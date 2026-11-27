/**
 * EXCO Database Layer
 * SQLite database with migrations and type-safe queries
 */

import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import {
  DB_NAME,
  DB_VERSION,
  DB_TABLES,
  getDbPath,
} from '@shared/constants';
import {
  Conversation,
  Message,
  Workspace,
  Settings,
  ApiKeyEntry,
  AIProvider,
  AIModel,
  MCPServerConfig,
  GovernanceFiles,
} from '@shared/types';
import { validateInput } from '@shared/schemas';
import {
  conversationSchema,
  messageSchema,
  workspaceSchema,
  settingsSchema,
  apiKeyEntrySchema,
  aiProviderSchema,
  aiModelSchema,
  mcpServerConfigSchema,
} from '@shared/schemas';
import { generateId, now } from '@shared/utils';

// ============================================================================
// Database Connection
// ============================================================================

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function initializeDatabase(appDataPath: string): Promise<Database.Database> {
  if (db) return db;

  await (Database as any).init?.();

  const dbPath = getDbPath(appDataPath);
  const dbDir = path.dirname(dbPath);

  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');

  // Run migrations
  runMigrations(db);

  // Scrub any legacy plaintext apiKey fields accidentally stored in providers.config
  try {
    const provRows = db.prepare(`SELECT id, config FROM ${DB_TABLES.PROVIDERS}`).all() as Array<{ id: string; config: string }>;
    for (const row of provRows) {
      if (!row.config) continue;
      try {
        const parsed = JSON.parse(row.config);
        if (parsed && typeof parsed === 'object' && 'apiKey' in parsed) {
          const { apiKey: _removed, ...cleanConfig } = parsed;
          db.prepare(`UPDATE ${DB_TABLES.PROVIDERS} SET config = ? WHERE id = ?`).run(JSON.stringify(cleanConfig), row.id);
        }
      } catch {}
    }
  } catch {}

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// ============================================================================
// Migrations
// ============================================================================

function runMigrations(database: Database.Database): void {
  // Create migrations table if not exists
  database.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL
    );
  `);

  const currentVersion = getCurrentVersion(database);
  if (currentVersion >= DB_VERSION) return;

  // Migration 1: Initial schema
  if (currentVersion < 1) {
    runMigration1(database);
    setVersion(database, 1);
  }

  // Future migrations would go here
  // if (currentVersion < 2) { runMigration2(database); setVersion(database, 2); }
}

function getCurrentVersion(database: Database.Database): number {
  const row = database.prepare('SELECT MAX(version) as version FROM migrations').get() as { version: number | null };
  return row.version ?? 0;
}

function setVersion(database: Database.Database, version: number): void {
  database.prepare('INSERT INTO migrations (version, applied_at) VALUES (?, ?)').run(version, now());
}

function runMigration1(database: Database.Database): void {
  // Conversations table
  database.exec(`
    CREATE TABLE ${DB_TABLES.CONVERSATIONS} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      archived_at INTEGER,
      model_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      system_prompt TEXT,
      temperature REAL,
      max_tokens INTEGER,
      reasoning_effort TEXT
    );
  `);

  // Messages table
  database.exec(`
    CREATE TABLE ${DB_TABLES.MESSAGES} (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      model_id TEXT,
      provider_id TEXT,
      tool_calls TEXT,
      tool_call_id TEXT,
      tokens TEXT,
      status TEXT NOT NULL DEFAULT 'complete',
      FOREIGN KEY (conversation_id) REFERENCES ${DB_TABLES.CONVERSATIONS}(id) ON DELETE CASCADE
    );
  `);

  // Create index for messages by conversation
  database.exec(`
    CREATE INDEX idx_messages_conversation ON ${DB_TABLES.MESSAGES}(conversation_id, created_at);
  `);

  // Workspaces table
  database.exec(`
    CREATE TABLE ${DB_TABLES.WORKSPACES} (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      permission_level TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      metadata TEXT
    );
  `);

  // Settings table
  database.exec(`
    CREATE TABLE ${DB_TABLES.SETTINGS} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // API Keys table (encrypted keys stored)
  database.exec(`
    CREATE TABLE ${DB_TABLES.API_KEYS} (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL,
      key_name TEXT NOT NULL,
      encrypted_key TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      last_validated INTEGER,
      is_valid INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Providers table
  database.exec(`
    CREATE TABLE ${DB_TABLES.PROVIDERS} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      config TEXT NOT NULL,
      models TEXT NOT NULL DEFAULT '[]',
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // MCP Servers table
  database.exec(`
    CREATE TABLE ${DB_TABLES.MCP_SERVERS} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      command TEXT NOT NULL,
      args TEXT NOT NULL DEFAULT '[]',
      env TEXT NOT NULL DEFAULT '{}',
      enabled INTEGER NOT NULL DEFAULT 1,
      auto_connect INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Governance files table
  database.exec(`
    CREATE TABLE ${DB_TABLES.GOVERNANCE_FILES} (
      workspace_path TEXT NOT NULL,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (workspace_path, filename)
    );
  `);
}

// ============================================================================
// Conversation Operations
// ============================================================================

export function createConversation(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Conversation {
  const database = getDatabase();
  const id = generateId();
  const timestamp = now();

  const stmt = database.prepare(`
    INSERT INTO ${DB_TABLES.CONVERSATIONS} (id, title, created_at, updated_at, model_id, provider_id, system_prompt, temperature, max_tokens, reasoning_effort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    conversation.title,
    timestamp,
    timestamp,
    conversation.modelId,
    conversation.providerId,
    conversation.systemPrompt ?? null,
    conversation.temperature ?? null,
    conversation.maxTokens ?? null,
    conversation.reasoningEffort ?? null
  );

  return { ...conversation, id, createdAt: timestamp, updatedAt: timestamp };
}

export function getConversation(id: string): Conversation | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.CONVERSATIONS} WHERE id = ?`).get(id) as any;
  if (!row) return null;
  return mapConversationRow(row);
}

export function getConversations(includeArchived = false): Conversation[] {
  const database = getDatabase();
  const where = includeArchived ? '' : 'WHERE archived_at IS NULL';
  const rows = database.prepare(`SELECT * FROM ${DB_TABLES.CONVERSATIONS} ${where} ORDER BY updated_at DESC`).all() as any[];
  return rows.map(mapConversationRow);
}

export function updateConversation(id: string, updates: Partial<Conversation>): Conversation | null {
  const database = getDatabase();
  const existing = getConversation(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates, updatedAt: now() };

  const stmt = database.prepare(`
    UPDATE ${DB_TABLES.CONVERSATIONS}
    SET title = ?, updated_at = ?, archived_at = ?, model_id = ?, provider_id = ?,
        system_prompt = ?, temperature = ?, max_tokens = ?, reasoning_effort = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.title,
    updated.updatedAt,
    updated.archivedAt ?? null,
    updated.modelId,
    updated.providerId,
    updated.systemPrompt ?? null,
    updated.temperature ?? null,
    updated.maxTokens ?? null,
    updated.reasoningEffort ?? null,
    id
  );

  return updated;
}

export function deleteConversation(id: string): boolean {
  const database = getDatabase();
  const result = database.prepare(`DELETE FROM ${DB_TABLES.CONVERSATIONS} WHERE id = ?`).run(id);
  return result.changes > 0;
}

export function archiveConversation(id: string): Conversation | null {
  return updateConversation(id, { archivedAt: now() });
}

export function restoreConversation(id: string): Conversation | null {
  return updateConversation(id, { archivedAt: undefined });
}

function mapConversationRow(row: any): Conversation {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at ?? undefined,
    modelId: row.model_id,
    providerId: row.provider_id,
    systemPrompt: row.system_prompt ?? undefined,
    temperature: row.temperature ?? undefined,
    maxTokens: row.max_tokens ?? undefined,
    reasoningEffort: row.reasoning_effort ?? undefined,
  };
}

// ============================================================================
// Message Operations
// ============================================================================

export function createMessage(message: Omit<Message, 'id' | 'createdAt'>): Message {
  const database = getDatabase();
  const id = generateId();
  const timestamp = now();

  const stmt = database.prepare(`
    INSERT INTO ${DB_TABLES.MESSAGES} (id, conversation_id, role, content, created_at, model_id, provider_id, tool_calls, tool_call_id, tokens, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    message.conversationId,
    message.role,
    typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
    timestamp,
    message.modelId ?? null,
    message.providerId ?? null,
    message.toolCalls ? JSON.stringify(message.toolCalls) : null,
    message.toolCallId ?? null,
    message.tokens ? JSON.stringify(message.tokens) : null,
    message.status
  );

  // Update conversation updated_at
  database.prepare(`UPDATE ${DB_TABLES.CONVERSATIONS} SET updated_at = ? WHERE id = ?`).run(timestamp, message.conversationId);

  return { ...message, id, createdAt: timestamp };
}

export function getMessages(conversationId: string, limit = 100, offset = 0): Message[] {
  const database = getDatabase();
  const rows = database.prepare(`
    SELECT * FROM ${DB_TABLES.MESSAGES}
    WHERE conversation_id = ?
    ORDER BY created_at ASC
    LIMIT ? OFFSET ?
  `).all(conversationId, limit, offset) as any[];

  return rows.map(mapMessageRow);
}

export function updateMessage(id: string, updates: Partial<Message>): Message | null {
  const database = getDatabase();
  const existing = getMessage(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };

  const stmt = database.prepare(`
    UPDATE ${DB_TABLES.MESSAGES}
    SET role = ?, content = ?, model_id = ?, provider_id = ?, tool_calls = ?, tool_call_id = ?, tokens = ?, status = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.role,
    typeof updated.content === 'string' ? updated.content : JSON.stringify(updated.content),
    updated.modelId ?? null,
    updated.providerId ?? null,
    updated.toolCalls ? JSON.stringify(updated.toolCalls) : null,
    updated.toolCallId ?? null,
    updated.tokens ? JSON.stringify(updated.tokens) : null,
    updated.status,
    id
  );

  return updated;
}

export function getMessage(id: string): Message | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.MESSAGES} WHERE id = ?`).get(id) as any;
  if (!row) return null;
  return mapMessageRow(row);
}

export function deleteMessagesByConversation(conversationId: string): number {
  const database = getDatabase();
  const result = database.prepare(`DELETE FROM ${DB_TABLES.MESSAGES} WHERE conversation_id = ?`).run(conversationId);
  return result.changes;
}

export function getTokenUsageByModel(): Record<string, number> {
  const database = getDatabase();
  const rows = database.prepare(`
    SELECT model_id, tokens FROM ${DB_TABLES.MESSAGES}
    WHERE role = 'assistant' AND tokens IS NOT NULL AND model_id IS NOT NULL
  `).all() as Array<{ model_id: string; tokens: string }>;

  const totals: Record<string, number> = {};
  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.tokens);
      const count = Number(parsed?.totalTokens) || ((Number(parsed?.inputTokens) || 0) + (Number(parsed?.outputTokens) || 0));
      if (count > 0 && row.model_id) {
        totals[row.model_id] = (totals[row.model_id] || 0) + count;
      }
    } catch {}
  }
  return totals;
}

function mapMessageRow(row: any): Message {
  let content: string | any[] = row.content;
  try {
    content = JSON.parse(row.content);
  } catch {
    // Keep as string
  }

  let toolCalls: Message['toolCalls'] = undefined;
  if (row.tool_calls) {
    try {
      toolCalls = JSON.parse(row.tool_calls);
    } catch {}
  }

  let tokens: Message['tokens'] = undefined;
  if (row.tokens) {
    try {
      tokens = JSON.parse(row.tokens);
    } catch {}
  }

  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content,
    createdAt: row.created_at,
    modelId: row.model_id ?? undefined,
    providerId: row.provider_id ?? undefined,
    toolCalls,
    toolCallId: row.tool_call_id ?? undefined,
    tokens,
    status: row.status,
  };
}

// ============================================================================
// Workspace Operations
// ============================================================================

export function createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Workspace {
  const database = getDatabase();
  const id = generateId();
  const timestamp = now();

  const stmt = database.prepare(`
    INSERT INTO ${DB_TABLES.WORKSPACES} (id, path, name, permission_level, created_at, updated_at, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, workspace.path, workspace.name, workspace.permissionLevel, timestamp, timestamp, JSON.stringify(workspace.metadata));

  return { ...workspace, id, createdAt: timestamp, updatedAt: timestamp };
}

export function getWorkspace(id: string): Workspace | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.WORKSPACES} WHERE id = ?`).get(id) as any;
  if (!row) return null;
  return mapWorkspaceRow(row);
}

export function getWorkspaceByPath(path: string): Workspace | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.WORKSPACES} WHERE path = ?`).get(path) as any;
  if (!row) return null;
  return mapWorkspaceRow(row);
}

export function getWorkspaces(): Workspace[] {
  const database = getDatabase();
  const rows = database.prepare(`SELECT * FROM ${DB_TABLES.WORKSPACES} ORDER BY updated_at DESC`).all() as any[];
  return rows.map(mapWorkspaceRow);
}

export function updateWorkspace(id: string, updates: Partial<Workspace>): Workspace | null {
  const database = getDatabase();
  const existing = getWorkspace(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates, updatedAt: now() };

  const stmt = database.prepare(`
    UPDATE ${DB_TABLES.WORKSPACES}
    SET name = ?, permission_level = ?, updated_at = ?, metadata = ?
    WHERE id = ?
  `);

  stmt.run(updated.name, updated.permissionLevel, updated.updatedAt, JSON.stringify(updated.metadata), id);

  return updated;
}

export function deleteWorkspace(id: string): boolean {
  const database = getDatabase();
  const result = database.prepare(`DELETE FROM ${DB_TABLES.WORKSPACES} WHERE id = ?`).run(id);
  return result.changes > 0;
}

function mapWorkspaceRow(row: any): Workspace {
  return {
    id: row.id,
    path: row.path,
    name: row.name,
    permissionLevel: row.permission_level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: JSON.parse(row.metadata || '{}'),
  };
}

// ============================================================================
// Settings Operations
// ============================================================================

export function getSetting<T>(key: string, defaultValue: T): T {
  const database = getDatabase();
  const row = database.prepare(`SELECT value FROM ${DB_TABLES.SETTINGS} WHERE key = ?`).get(key) as { value: string } | undefined;
  if (!row) return defaultValue;
  try {
    return JSON.parse(row.value);
  } catch {
    return defaultValue;
  }
}

export function setSetting(key: string, value: unknown): void {
  const database = getDatabase();
  database.prepare(`INSERT OR REPLACE INTO ${DB_TABLES.SETTINGS} (key, value) VALUES (?, ?)`).run(key, JSON.stringify(value));
}

export function getAllSettings(): Record<string, unknown> {
  const database = getDatabase();
  const rows = database.prepare(`SELECT key, value FROM ${DB_TABLES.SETTINGS}`).all() as { key: string; value: string }[];
  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch {
      settings[row.key] = row.value;
    }
  }
  return settings;
}

export function getSettings(): Settings {
  const database = getDatabase();
  const defaults = {
    theme: 'system',
    fontSize: 14,
    fontFamily: 'Inter, system-ui, sans-serif',
    terminalFontSize: 13,
    terminalFontFamily: 'JetBrains Mono, Fira Code, monospace',
    autoSave: true,
    autoSaveInterval: 2000,
    language: 'en',
    startupBehavior: 'welcome',
    telemetryEnabled: false,
    compactMode: false,
    animationsEnabled: true,
  };

  const stored = getAllSettings();
  return { ...defaults, ...stored } as Settings;
}

export function updateSettings(updates: Partial<Settings>): Settings {
  const current = getSettings();
  const updated = { ...current, ...updates };
  for (const [key, value] of Object.entries(updated)) {
    setSetting(key, value);
  }
  return updated;
}

// ============================================================================
// API Key Operations
// ============================================================================

export function createApiKey(entry: Omit<ApiKeyEntry, 'id' | 'createdAt' | 'encryptedKey'> & { key: string; encryptedKey?: string }): ApiKeyEntry {
  const database = getDatabase();
  const id = generateId();
  const timestamp = now();

  const encryptedKey = entry.encryptedKey || entry.key;

  const stmt = database.prepare(`
    INSERT INTO ${DB_TABLES.API_KEYS} (id, provider_id, key_name, encrypted_key, created_at, last_validated, is_valid)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, entry.providerId, entry.keyName, encryptedKey, timestamp, null, 0);

  return {
    id,
    providerId: entry.providerId,
    keyName: entry.keyName,
    createdAt: timestamp,
    encryptedKey,
    lastValidated: undefined,
    isValid: false,
  };
}

export function getApiKeys(): ApiKeyEntry[] {
  const database = getDatabase();
  const rows = database.prepare(`SELECT * FROM ${DB_TABLES.API_KEYS} ORDER BY created_at DESC`).all() as any[];
  return rows.map(mapApiKeyRow);
}

export function getApiKey(id: string): ApiKeyEntry | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.API_KEYS} WHERE id = ?`).get(id) as any;
  if (!row) return null;
  return mapApiKeyRow(row);
}

export function getApiKeyByProvider(providerId: string): ApiKeyEntry | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.API_KEYS} WHERE provider_id = ? ORDER BY created_at DESC LIMIT 1`).get(providerId) as any;
  if (!row) return null;
  return mapApiKeyRow(row);
}

export function deleteApiKey(id: string): boolean {
  const database = getDatabase();
  const result = database.prepare(`DELETE FROM ${DB_TABLES.API_KEYS} WHERE id = ?`).run(id);
  return result.changes > 0;
}

export function updateApiKeyValidation(id: string, isValid: boolean): void {
  const database = getDatabase();
  database.prepare(`UPDATE ${DB_TABLES.API_KEYS} SET is_valid = ?, last_validated = ? WHERE id = ?`).run(isValid ? 1 : 0, now(), id);
}

function mapApiKeyRow(row: any): ApiKeyEntry {
  return {
    id: row.id,
    providerId: row.provider_id,
    keyName: row.key_name,
    encryptedKey: row.encrypted_key,
    createdAt: row.created_at,
    lastValidated: row.last_validated ?? undefined,
    isValid: Boolean(row.is_valid),
  };
}

// ============================================================================
// Provider Operations
// ============================================================================

function sanitizeProviderConfigForStorage(config: AIProvider['config'] | undefined): Record<string, any> {
  if (!config || typeof config !== 'object') return {};
  const { apiKey: _dropped, ...safeConfig } = config as Record<string, any>;
  return safeConfig;
}

export function createProvider(provider: Omit<AIProvider, 'id' | 'createdAt' | 'updatedAt'>): AIProvider {
  const database = getDatabase();
  const id = generateId();
  const timestamp = now();
  const safeConfig = sanitizeProviderConfigForStorage(provider.config);

  const stmt = database.prepare(`
    INSERT INTO ${DB_TABLES.PROVIDERS} (id, name, type, config, models, enabled, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    provider.name,
    provider.type,
    JSON.stringify(safeConfig),
    JSON.stringify(provider.models),
    provider.enabled ? 1 : 0,
    timestamp,
    timestamp
  );

  return { ...provider, config: safeConfig, id, createdAt: timestamp, updatedAt: timestamp };
}

export function getProviders(): AIProvider[] {
  const database = getDatabase();
  const rows = database.prepare(`SELECT * FROM ${DB_TABLES.PROVIDERS} ORDER BY created_at DESC`).all() as any[];
  return rows.map(mapProviderRow);
}

export function getProvider(id: string): AIProvider | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.PROVIDERS} WHERE id = ?`).get(id) as any;
  if (!row) return null;
  return mapProviderRow(row);
}

export function getEnabledProviders(): AIProvider[] {
  const database = getDatabase();
  const rows = database.prepare(`SELECT * FROM ${DB_TABLES.PROVIDERS} WHERE enabled = 1 ORDER BY created_at DESC`).all() as any[];
  return rows.map(mapProviderRow);
}

export function updateProvider(id: string, updates: Partial<AIProvider>): AIProvider | null {
  const database = getDatabase();
  const existing = getProvider(id);
  if (!existing) return null;

  const safeUpdates = updates.config
    ? { ...updates, config: sanitizeProviderConfigForStorage(updates.config) }
    : updates;
  const updated = { ...existing, ...safeUpdates, updatedAt: now() };

  const stmt = database.prepare(`
    UPDATE ${DB_TABLES.PROVIDERS}
    SET name = ?, type = ?, config = ?, models = ?, enabled = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.name,
    updated.type,
    JSON.stringify(sanitizeProviderConfigForStorage(updated.config)),
    JSON.stringify(updated.models),
    updated.enabled ? 1 : 0,
    updated.updatedAt,
    id
  );

  return updated;
}

export function deleteProvider(id: string): boolean {
  const database = getDatabase();
  const result = database.prepare(`DELETE FROM ${DB_TABLES.PROVIDERS} WHERE id = ?`).run(id);
  return result.changes > 0;
}

function mapProviderRow(row: any): AIProvider {
  let safeConfig: Record<string, any> = {};
  try {
    safeConfig = sanitizeProviderConfigForStorage(JSON.parse(row.config || '{}'));
  } catch {}
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    config: safeConfig,
    models: JSON.parse(row.models || '[]'),
    enabled: Boolean(row.enabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// MCP Server Operations
// ============================================================================

export function createMcpServer(server: Omit<MCPServerConfig, 'id' | 'createdAt' | 'updatedAt'>): MCPServerConfig {
  const database = getDatabase();
  const id = generateId();
  const timestamp = now();

  const stmt = database.prepare(`
    INSERT INTO ${DB_TABLES.MCP_SERVERS} (id, name, command, args, env, enabled, auto_connect, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, server.name, server.command, JSON.stringify(server.args), JSON.stringify(server.env), server.enabled ? 1 : 0, server.autoConnect ? 1 : 0, timestamp, timestamp);

  return { ...server, id, createdAt: timestamp, updatedAt: timestamp };
}

export function getMcpServers(): MCPServerConfig[] {
  const database = getDatabase();
  const rows = database.prepare(`SELECT * FROM ${DB_TABLES.MCP_SERVERS} ORDER BY created_at DESC`).all() as any[];
  return rows.map(mapMcpServerRow);
}

export function getMcpServer(id: string): MCPServerConfig | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT * FROM ${DB_TABLES.MCP_SERVERS} WHERE id = ?`).get(id) as any;
  if (!row) return null;
  return mapMcpServerRow(row);
}

export function updateMcpServer(id: string, updates: Partial<MCPServerConfig>): MCPServerConfig | null {
  const database = getDatabase();
  const existing = getMcpServer(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates, updatedAt: now() };

  const stmt = database.prepare(`
    UPDATE ${DB_TABLES.MCP_SERVERS}
    SET name = ?, command = ?, args = ?, env = ?, enabled = ?, auto_connect = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(updated.name, updated.command, JSON.stringify(updated.args), JSON.stringify(updated.env), updated.enabled ? 1 : 0, updated.autoConnect ? 1 : 0, updated.updatedAt, id);

  return updated;
}

export function deleteMcpServer(id: string): boolean {
  const database = getDatabase();
  const result = database.prepare(`DELETE FROM ${DB_TABLES.MCP_SERVERS} WHERE id = ?`).run(id);
  return result.changes > 0;
}

function mapMcpServerRow(row: any): MCPServerConfig {
  return {
    id: row.id,
    name: row.name,
    command: row.command,
    args: JSON.parse(row.args || '[]'),
    env: JSON.parse(row.env || '{}'),
    enabled: Boolean(row.enabled),
    autoConnect: Boolean(row.auto_connect),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// Governance File Operations
// ============================================================================

export function getGovernanceFile(workspacePath: string, filename: string): string | null {
  const database = getDatabase();
  const row = database.prepare(`SELECT content FROM ${DB_TABLES.GOVERNANCE_FILES} WHERE workspace_path = ? AND filename = ?`).get(workspacePath, filename) as { content: string } | undefined;
  return row?.content ?? null;
}

export function setGovernanceFile(workspacePath: string, filename: string, content: string): void {
  const database = getDatabase();
  database.prepare(`
    INSERT OR REPLACE INTO ${DB_TABLES.GOVERNANCE_FILES} (workspace_path, filename, content, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(workspacePath, filename, content, now());
}

export function getAllGovernanceFiles(workspacePath: string): Record<string, string> {
  const database = getDatabase();
  const rows = database.prepare(`SELECT filename, content FROM ${DB_TABLES.GOVERNANCE_FILES} WHERE workspace_path = ?`).all(workspacePath) as { filename: string; content: string }[];
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.filename] = row.content;
  }
  return result;
}

export function deleteGovernanceFiles(workspacePath: string): void {
  const database = getDatabase();
  database.prepare(`DELETE FROM ${DB_TABLES.GOVERNANCE_FILES} WHERE workspace_path = ?`).run(workspacePath);
}