/**
 * EXCO MCP Client
 * Model Context Protocol client implementation for connecting to MCP servers
 */

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import type { MCPServerConfig, MCPTool } from '@shared/types';

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: { code: number; message: string; data?: any };
}

interface MCPNotification {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

type MCPMessage = MCPRequest | MCPResponse | MCPNotification;

export class MCPClient {
  private serverConfig: MCPServerConfig;
  private process: ChildProcess | null = null;
  private requestId = 0;
  private pendingRequests: Map<string | number, { resolve: (value: any) => void; reject: (error: Error) => void }> = new Map();
  private connected = false;
  private tools: MCPTool[] = [];
  private stderrBuffer = '';

  constructor(serverConfig: MCPServerConfig) {
    this.serverConfig = serverConfig;
  }

  async connect(): Promise<{ success: boolean; tools: MCPTool[]; error?: string }> {
    if (this.connected) {
      return { success: true, tools: this.tools };
    }

    return new Promise((resolve) => {
      try {
        this.process = this.spawnServer();
        this.setupProcessHandlers(resolve);
      } catch (error) {
        resolve({ success: false, tools: [], error: error instanceof Error ? error.message : 'Failed to spawn server' });
      }
    });
  }

  private spawnServer(): ChildProcess {
    const { command, args, env } = this.serverConfig;

    // Resolve command path
    let resolvedCommand = command;
    if (!path.isAbsolute(command) && !command.includes('/') && !command.includes('\\')) {
      // Check if it's in PATH or use npx
      if (command === 'npx' || command === 'node') {
        resolvedCommand = command;
      }
    }

    const child = spawn(resolvedCommand, args, {
      env: { ...process.env, ...env },
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
      shell: process.platform === 'win32',
    });

    return child;
  }

  private setupProcessHandlers(resolve: (value: { success: boolean; tools: MCPTool[]; error?: string }) => void): void {
    if (!this.process) return;

    let stdoutBuffer = '';
    let settled = false;
    const finish = (val: { success: boolean; tools: MCPTool[]; error?: string }) => {
      if (!settled) {
        settled = true;
        resolve(val);
      }
    };

    this.process.stdout?.on('data', (data: Buffer) => {
      stdoutBuffer += data.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          this.handleMessage(line.trim());
        }
      }
    });

    this.process.stderr?.on('data', (data: Buffer) => {
      this.stderrBuffer += data.toString();
      console.error(`[MCP ${this.serverConfig.name}] stderr:`, data.toString());
    });

    this.process.on('error', (error) => {
      console.error(`[MCP ${this.serverConfig.name}] process error:`, error);
      finish({ success: false, tools: [], error: error.message });
    });

    this.process.on('exit', (code, signal) => {
      console.log(`[MCP ${this.serverConfig.name}] exited with code ${code}, signal ${signal}`);
      const detail = this.stderrBuffer.trim();
      finish({
        success: false,
        tools: [],
        error: detail || `Server exited before initialization (code ${code ?? 'null'})`,
      });
      this.connected = false;
      this.cleanup();
    });

    // Send initialize request after a short delay
    setTimeout(() => {
      if (settled) return;
      this.initialize().then(result => {
        if (result.success) {
          this.listTools().then(tools => {
            this.tools = tools.map(t => ({ ...t, serverId: this.serverConfig.id }));
            this.connected = true;
            finish({ success: true, tools: this.tools });
          }).catch(err => {
            finish({ success: false, tools: [], error: err.message });
          });
        } else {
          finish({ success: false, tools: [], error: result.error });
        }
      }).catch(err => {
        finish({ success: false, tools: [], error: err.message });
      });
    }, 500);
  }

  private handleMessage(line: string): void {
    try {
      const message: MCPMessage = JSON.parse(line);

      if ('id' in message && message.id !== undefined) {
        // Response to a request
        const pending = this.pendingRequests.get(message.id);
        if (pending) {
          this.pendingRequests.delete(message.id);
          const response = message as MCPResponse;
          if (response.error) {
            pending.reject(new Error(response.error.message));
          } else {
            pending.resolve(response.result);
          }
        }
      } else if ('method' in message && !('id' in message)) {
        // Notification
        this.handleNotification(message);
      }
    } catch (error) {
      console.error(`[MCP ${this.serverConfig.name}] failed to parse message:`, line, error);
    }
  }

  private handleNotification(notification: MCPNotification): void {
    switch (notification.method) {
      case 'notifications/tools/list_changed':
        // Tools list changed, could re-fetch
        break;
      case 'notifications/resources/list_changed':
        break;
      case 'notifications/progress':
        break;
    }
  }

  private async initialize(): Promise<{ success: boolean; error?: string }> {
    await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
      clientInfo: {
        name: 'EXCO',
        version: '1.0.0',
      },
    });

    // Send initialized notification
    await this.sendNotification('notifications/initialized', {});

    return { success: true };
  }

  async listTools(): Promise<MCPTool[]> {
    const result = await this.sendRequest('tools/list', {});
    return Array.isArray(result?.tools) ? result.tools : [];
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<any> {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  async listResources(): Promise<any[]> {
    const result = await this.sendRequest('resources/list', {});
    return Array.isArray(result?.resources) ? result.resources : [];
  }

  async readResource(uri: string): Promise<any> {
    return this.sendRequest('resources/read', { uri });
  }

  private sendRequest(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin?.writable) {
        reject(new Error('Process not available'));
        return;
      }

      const id = ++this.requestId;
      const request: MCPRequest = { jsonrpc: '2.0', id, method, params };

      this.pendingRequests.set(id, { resolve, reject });

      const message = JSON.stringify(request) + '\n';
      this.process.stdin.write(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  private sendNotification(method: string, params?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin?.writable) {
        reject(new Error('Process not available'));
        return;
      }

      const notification: MCPNotification = { jsonrpc: '2.0', method, params };
      const message = JSON.stringify(notification) + '\n';
      this.process.stdin.write(message);
      resolve();
    });
  }

  private cleanup(): void {
    for (const [, pending] of this.pendingRequests) {
      pending.reject(new Error('Client disconnected'));
    }
    this.pendingRequests.clear();
    this.connected = false;
    this.tools = [];
  }

  async disconnect(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    this.cleanup();
  }

  isConnected(): boolean {
    return this.connected;
  }

  getTools(): MCPTool[] {
    return this.tools;
  }

  getServerConfig(): MCPServerConfig {
    return this.serverConfig;
  }
}

// ============================================================================
// MCP Client Manager
// ============================================================================

const clients: Map<string, MCPClient> = new Map();

export function createMCPClient(config: MCPServerConfig): MCPClient {
  const client = new MCPClient(config);
  clients.set(config.id, client);
  return client;
}

export function getMCPClient(serverId: string): MCPClient | undefined {
  return clients.get(serverId);
}

export function getAllMCPClients(): MCPClient[] {
  return Array.from(clients.values());
}

export async function connectMCPServer(serverId: string): Promise<{ success: boolean; tools: MCPTool[]; error?: string }> {
  const client = clients.get(serverId);
  if (!client) {
    return { success: false, tools: [], error: 'Client not found' };
  }
  return client.connect();
}

export async function disconnectMCPServer(serverId: string): Promise<void> {
  const client = clients.get(serverId);
  if (client) {
    await client.disconnect();
    clients.delete(serverId);
  }
}

export async function callMCPTool(serverId: string, toolName: string, args: Record<string, unknown>): Promise<any> {
  const client = clients.get(serverId);
  if (!client) {
    throw new Error('MCP client not found');
  }
  return client.callTool(toolName, args);
}