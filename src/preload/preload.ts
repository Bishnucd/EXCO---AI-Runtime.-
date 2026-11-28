/**
 * EXCO Preload Script
 * Secure IPC bridge between main and renderer processes
 * Uses contextBridge to expose typed APIs
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import type {
  AppConfig,
  Conversation,
  Message,
  AIProvider,
  AIModel,
  ApiKeyEntry,
  Settings,
  Workspace,
  FileSystemNode,
  TerminalSession,
  TerminalOutput,
  MCPServerConfig,
  MCPTool,
  StreamChunk,
} from '@shared/types';

// ============================================================================
// Type-safe IPC Wrapper
// ============================================================================

type IpcHandler<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

function createInvoke<TInput, TOutput>(channel: string): IpcHandler<TInput, TOutput> {
  return (input: TInput) => ipcRenderer.invoke(channel, input);
}

function createOn<T>(channel: string, listener: (data: T) => void): () => void {
  const handler = (_event: IpcRendererEvent, data: T) => listener(data);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.off(channel, handler);
}

// ============================================================================
// App API
// ============================================================================

const appApi = {
  getConfig: createInvoke<void, AppConfig>('app:get-config'),
  setConfig: createInvoke<Partial<AppConfig>, AppConfig>('app:set-config'),
  getVersion: createInvoke<void, { version: string; platform: string }>('app:ready'),
  quit: createInvoke<void, void>('app:quit'),
  openExternal: createInvoke<string, boolean>('app:open-external'),
};

// ============================================================================
// Chat API
// ============================================================================

const chatApi = {
  listConversations: createInvoke<void, Conversation[]>('chat:list-conversations'),
  createConversation: createInvoke<Partial<Conversation>, Conversation>('chat:create-conversation'),
  updateConversation: createInvoke<{ id: string; updates: Partial<Conversation> }, Conversation>('chat:update-conversation'),
  deleteConversation: createInvoke<string, void>('chat:delete-conversation'),
  archiveConversation: createInvoke<string, Conversation>('chat:archive-conversation'),
  getMessages: createInvoke<string, Message[]>('chat:get-messages'),
  sendMessage: createInvoke<{ conversationId: string; content: string | any[]; attachments?: any[]; modelId?: string; providerId?: string; keyId?: string; preferredFailover?: boolean; workflowMode?: 'turbo' | 'standard' | 'deep-thought'; skillContext?: string }, { aborted?: boolean; userMessage: Message; assistantMessage: Message; routing?: { taskType: string; selectedModel: string; selectedProvider: string; overviewerModelId?: string; failoverCount?: number } }>('chat:send-message'),
  streamMessage: createInvoke<{ conversationId: string; content: string | any[]; modelId: string }, AsyncIterable<StreamChunk>>('chat:stream-message'),
  cancelStream: createInvoke<string, void>('chat:cancel-stream'),
  regenerateMessage: createInvoke<string, Message>('chat:regenerate-message'),
  transcribeAudio: createInvoke<{ wavBase64: string; keyId?: string; preferredEngine?: 'auto' | 'gemini' | 'openai-whisper' | 'windows-speech'; language?: string }, { text: string; source: string; error?: string }>('chat:transcribe-audio'),
  voiceTurn: createInvoke<{
    sessionId: string;
    conversationId?: string;
    userText: string;
    voiceHistory: Array<{ role: 'user' | 'assistant'; text: string }>;
    modelId?: string;
    providerId?: string;
    keyId?: string;
    preferredFailover?: boolean;
    workflowMode?: 'turbo' | 'standard' | 'deep-thought';
    skillContext?: string;
    language?: string;
  }, {
    aborted?: boolean;
    assistantText: string;
    modelId: string;
    providerId: string;
    tokens?: { inputTokens: number; outputTokens: number; totalTokens: number };
    overviewerModelId?: string;
    failoverCount?: number;
    error?: string;
  }>('chat:voice-turn'),
  cancelVoiceTurn: createInvoke<string, void>('chat:cancel-voice'),
  saveVoiceSession: createInvoke<{
    conversationId?: string;
    payload: import('@shared/types').VoiceSessionPayload;
    modelId?: string;
    providerId?: string;
  }, {
    conversationId: string;
    conversation: Conversation | null;
    message: Message;
  }>('chat:save-voice-session'),
  synthesizeSpeech: createInvoke<{
    text: string;
    engine?: 'edge-neural' | 'elevenlabs' | 'gemini' | 'openai' | 'custom' | 'system';
    voice?: string;
    modelId?: string;
    baseUrl?: string;
    speed?: number;
    pitch?: number;
    keyId?: string;
  }, { audioBase64?: string; mimeType?: string; source?: string; warning?: string; error?: string }>('chat:synthesize-speech'),
  listApiVoices: createInvoke<void, Array<{
    id: string;
    engine: 'elevenlabs' | 'gemini' | 'openai' | 'custom';
    keyId: string;
    keyName: string;
    voiceId: string;
    modelId?: string;
    baseUrl?: string;
    name: string;
    category?: string;
    description?: string;
    previewUrl?: string;
  }>>('chat:list-api-voices'),
  warmTts: createInvoke<string | void, boolean>('chat:warm-tts'),
  listSystemVoices: createInvoke<void, Array<{ name: string; culture: string }>>('chat:list-system-voices'),
  onVoiceProgress: (listener: (ev: {
    sessionId: string;
    type: 'routing' | 'status' | 'chunk' | 'done';
    statusText?: string;
    content?: string;
    modelId?: string;
    providerId?: string;
    taskType?: string;
    overviewerModelId?: string;
  }) => void) => {
    return createOn('chat:voice-progress', listener);
  },
  onChatProgress: (listener: (ev: { conversationId: string; type: 'routing' | 'status' | 'chunk' | 'done'; statusText?: string; content?: string; modelId?: string; providerId?: string; taskType?: string; overviewerModelId?: string }) => void) => {
    return createOn('chat:live-progress', listener);
  },
  onMessageStream: (conversationId: string, listener: (chunk: StreamChunk) => void) => {
    // This would be handled via event listeners in a real implementation
    return () => {};
  },
};

// ============================================================================
// Provider API
// ============================================================================

const providersApi = {
  list: createInvoke<void, AIProvider[]>('providers:list'),
  create: createInvoke<Omit<AIProvider, 'id' | 'createdAt' | 'updatedAt'>, AIProvider>('providers:create'),
  update: createInvoke<{ id: string; updates: Partial<AIProvider> }, AIProvider>('providers:update'),
  delete: createInvoke<string, void>('providers:delete'),
  test: createInvoke<string, { success: boolean; error?: string }>('providers:test'),
  listModels: createInvoke<string | { providerId?: string; keyId?: string; allKeys?: boolean }, AIModel[]>('providers:list-models'),
  getUsage: createInvoke<{ keyId?: string } | void, { tokensUsed: number; tokenCap: number | null; requests: number; resetsAt: string | null; source: string }>('providers:get-usage'),
  getDailyBenchmarks: createInvoke<void, { date: string; fetchedAt: number; source: string; telemetryById: Record<string, { contextLength?: number; promptCost?: number; completionCost?: number }> }>('models:fetch-daily-benchmarks'),
};

// ============================================================================
// API Keys API
// ============================================================================

const keysApi = {
  list: createInvoke<void, ApiKeyEntry[]>('keys:list'),
  create: createInvoke<{ providerId?: string; keyName: string; key: string }, ApiKeyEntry>('keys:create'),
  delete: createInvoke<string, void>('keys:delete'),
  validate: createInvoke<string, { valid: boolean; error?: string }>('keys:validate'),
};

// ============================================================================
// Workspace API
// ============================================================================

const workspaceApi = {
  select: createInvoke<void, Workspace | null>('workspace:select'),
  listRecent: createInvoke<void, Workspace[]>('workspace:list-recent'),
  open: createInvoke<string, Workspace>('workspace:open'),
  close: createInvoke<void, void>('workspace:close'),
  setAllowedPaths: createInvoke<string[], string[]>('workspace:set-allowed-paths'),
  listProjects: createInvoke<void, any[]>('workspace:list-projects'),
  saveProjects: createInvoke<any[], boolean>('workspace:save-projects'),
  deleteDbEntry: createInvoke<string, boolean>('workspace:delete-db-entry'),
};

// ============================================================================
// File System API
// ============================================================================

const fsApi = {
  readDir: createInvoke<string, FileSystemNode[]>('fs:read-dir'),
  readFile: createInvoke<string, { content: string; encoding: string }>('fs:read-file'),
  writeFile: createInvoke<{ path: string; content: string; encoding?: string }, void>('fs:write-file'),
  exists: createInvoke<string, { exists: boolean; isDirectory: boolean }>('fs:exists'),
  delete: createInvoke<string, void>('fs:delete'),
  rename: createInvoke<{ oldPath: string; newPath: string }, void>('fs:rename'),
  createDir: createInvoke<string, void>('fs:create-dir'),
  watch: createInvoke<string, void>('fs:watch'),
  unwatch: createInvoke<string, void>('fs:unwatch'),
  onChange: (listener: (data: { path: string; eventType: string; filename: string }) => void) => {
    return createOn('fs:changed', listener);
  },
};

// ============================================================================
// Terminal API
// ============================================================================

const terminalApi = {
  create: createInvoke<{ workspaceId: string; cwd?: string; cols: number; rows: number }, TerminalSession>('terminal:create'),
  resize: createInvoke<{ sessionId: string; cols: number; rows: number }, void>('terminal:resize'),
  write: createInvoke<{ sessionId: string; data: string }, void>('terminal:write'),
  close: createInvoke<string, void>('terminal:close'),
  onData: (listener: (data: TerminalOutput) => void) => {
    return createOn('terminal:on-data', listener);
  },
  onExit: (listener: (data: { sessionId: string; code: number }) => void) => {
    return createOn('terminal:on-exit', listener);
  },
};

// ============================================================================
// Settings API
// ============================================================================

const settingsApi = {
  get: createInvoke<void, Settings>('settings:get'),
  set: createInvoke<Partial<Settings>, Settings>('settings:set'),
  onChange: (listener: (settings: Settings) => void) => {
    return createOn('settings:changed', listener);
  },
};

// ============================================================================
// MCP API
// ============================================================================

const mcpApi = {
  listServers: createInvoke<void, MCPServerConfig[]>('mcp:list-servers'),
  createServer: createInvoke<Omit<MCPServerConfig, 'id' | 'createdAt' | 'updatedAt'>, MCPServerConfig>('mcp:create-server'),
  updateServer: createInvoke<{ id: string; updates: Partial<MCPServerConfig> }, MCPServerConfig>('mcp:update-server'),
  deleteServer: createInvoke<string, void>('mcp:delete-server'),
  connect: createInvoke<string, { success: boolean; tools: MCPTool[]; error?: string }>('mcp:connect'),
  disconnect: createInvoke<string, void>('mcp:disconnect'),
  callTool: createInvoke<{ serverId: string; toolName: string; args: Record<string, unknown> }, unknown>('mcp:call-tool'),
  onServerConnected: (listener: (data: { serverId: string; tools: MCPTool[] }) => void) => {
    return createOn('mcp:server-connected', listener);
  },
  onServerDisconnected: (listener: (serverId: string) => void) => {
    return createOn('mcp:server-disconnected', listener);
  },
};

// ============================================================================
// Governance API
// ============================================================================

const governanceApi = {
  read: createInvoke<string, string>('governance:read'),
  write: createInvoke<{ file: string; content: string }, void>('governance:write'),
  watch: createInvoke<string, void>('governance:watch'),
  unwatch: createInvoke<string, void>('governance:unwatch'),
  onChange: (listener: (data: { filename: string; content: string }) => void) => {
    return createOn('governance:changed', listener);
  },
};

// ============================================================================
// Window Controls API
// ============================================================================

const windowApi = {
  minimize: createInvoke<void, void>('window:minimize'),
  maximize: createInvoke<void, boolean>('window:maximize'),
  isMaximized: createInvoke<void, boolean>('window:is-maximized'),
  close: createInvoke<void, void>('window:close'),
};

// ============================================================================
// Auto Updater API
// ============================================================================

export interface AppUpdateState {
  status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'up-to-date' | 'error';
  currentVersion: string;
  availableVersion?: string;
  progress?: number;
  error?: string;
}

const updaterApi = {
  getStatus: createInvoke<void, AppUpdateState>('updater:get-status'),
  check: createInvoke<void, AppUpdateState>('updater:check'),
  installAndRestart: createInvoke<void, boolean>('updater:install'),
  onStatusChange: (listener: (status: AppUpdateState) => void) => {
    return createOn('updater:status', listener);
  },
};

const workAgentApi = {
  runAgent: createInvoke<{
    runId: string;
    conversationId?: string;
    workspacePath: string;
    workspacePaths?: string[];
    prompt: string | any[];
    attachments?: any[];
    modelId?: string;
    providerId?: string;
    keyId?: string;
    preferredFailover?: boolean;
    workflowMode?: 'turbo' | 'standard' | 'deep-thought';
    accessLevel: 'ask' | 'selected-folder' | 'full-access';
    skillContext?: string;
  }, { conversationId: string; userMessage: any; assistantMessage: any; steps: any[] }>('work:run-agent'),
  listConversations: createInvoke<void, Conversation[]>('work:list-conversations'),
  approveAction: createInvoke<{ runId: string; stepId: string; decision: 'allow-once' | 'allow-run' | 'deny' }, boolean>('work:approve-action'),
  cancelAgent: createInvoke<string, boolean>('work:cancel-agent'),
  onAgentEvent: (listener: (data: any) => void) => {
    return createOn('work:agent-event', listener);
  },
};

const skillsApi = {
  syncState: createInvoke<{ customSkills: any[]; deletedIds: string[]; disabledIds: string[] }, { totalActive: number }>('skills:sync-state'),
  search: createInvoke<{ query: string; category?: string; limit?: number }, any[]>('skills:search'),
  list: createInvoke<void, any[]>('skills:list'),
};

// ============================================================================
// Expose API to Renderer
// ============================================================================

contextBridge.exposeInMainWorld('exco', {
  app: appApi,
  window: windowApi,
  updater: updaterApi,
  chat: chatApi,
  work: workAgentApi,
  skills: skillsApi,
  providers: providersApi,
  keys: keysApi,
  workspace: workspaceApi,
  fs: fsApi,
  terminal: terminalApi,
  settings: settingsApi,
  mcp: mcpApi,
  governance: governanceApi,
});

// ============================================================================
// Type Declaration for Renderer
// ============================================================================

// This allows TypeScript to know about the exposed API in the renderer
declare global {
  interface Window {
    exco: {
      app: typeof appApi;
      window: typeof windowApi;
      updater: typeof updaterApi;
      chat: typeof chatApi;
      work: typeof workAgentApi;
      skills: typeof skillsApi;
      providers: typeof providersApi;
      keys: typeof keysApi;
      workspace: typeof workspaceApi;
      fs: typeof fsApi;
      terminal: typeof terminalApi;
      settings: typeof settingsApi;
      mcp: typeof mcpApi;
      governance: typeof governanceApi;
    };
  }
}