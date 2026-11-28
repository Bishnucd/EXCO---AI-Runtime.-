/**
 * EXCO Shared Types
 * Core type definitions shared across main, renderer, and preload processes
 */

// ============================================================================
// Application Core Types
// ============================================================================

export type OperatingMode = 'chatbot' | 'work';

export type PermissionLevel = 'ask' | 'selected-folder' | 'full-access';

export interface AppConfig {
  mode: OperatingMode;
  theme: ThemeMode;
  permissionLevel: PermissionLevel;
  workspacePath?: string;
  recentWorkspaces: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

// ============================================================================
// Chatbot Mode Types
// ============================================================================

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
  modelId: string;
  providerId: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: ReasoningEffort;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string | MessageContent[];
  createdAt: number;
  modelId?: string;
  providerId?: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
  tokens?: TokenUsage;
  status: MessageStatus;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

export type ReasoningEffort = 'low' | 'medium' | 'high';

export interface MessageContent {
  type: 'text' | 'image' | 'file';
  text?: string;
  imageUrl?: string;
  fileData?: FileData;
}

export interface FileData {
  name: string;
  mimeType: string;
  size: number;
  base64: string;
  textContent?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface VoiceTranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  modelId?: string;
  providerId?: string;
}

export interface VoiceSessionPayload {
  version: 1;
  startedAt: number;
  endedAt: number;
  durationSec: number;
  entries: VoiceTranscriptEntry[];
  modelsUsed?: string[];
}

// ============================================================================
// AI Provider Types
// ============================================================================

export interface AIProvider {
  id: string;
  name: string;
  type: ProviderType;
  config: ProviderConfig;
  models: AIModel[];
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export type ProviderType = 'anthropic' | 'openai' | 'google' | 'ollama' | 'openrouter' | 'custom';

export interface ProviderConfig {
  apiKey?: string; // Encrypted in storage
  baseUrl?: string;
  organization?: string;
  customHeaders?: Record<string, string>;
}

export interface AIModel {
  id: string;
  name: string;
  providerId: string;
  capabilities: ModelCapabilities;
  contextWindow: number;
  maxOutputTokens: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
  supportsReasoning: boolean;
  pricing?: ModelPricing;
  tokensUsed?: number;
  tokenCap?: number | null;
  tier?: 'free' | 'paid';
  category?: 'turbo' | 'standard' | 'deep-thought';
  isAvailable?: boolean;
}

export interface ModelCapabilities {
  chat: boolean;
  completion: boolean;
  embedding: boolean;
  imageGeneration: boolean;
  audioTranscription: boolean;
}

export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  currency: 'USD';
}

export interface ProviderCapabilities {
  streaming: boolean;
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
  systemPrompts: boolean;
}

// ============================================================================
// Work Mode Types
// ============================================================================

export interface Workspace {
  id: string;
  path: string;
  name: string;
  permissionLevel: PermissionLevel;
  createdAt: number;
  updatedAt: number;
  metadata: WorkspaceMetadata;
}

export interface WorkspaceMetadata {
  projectType?: string;
  framework?: string;
  language?: string;
  gitRepository?: boolean;
  excoFolder?: boolean;
}

export interface WorkProject {
  id: string;
  name: string;
  folders: Workspace[];
  syncedProjectIds: string[];
  conversationId?: string;
  conversationIds?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface FileSystemNode {
  path: string;
  name: string;
  type: 'file' | 'directory' | 'symlink';
  size?: number;
  modifiedAt: number;
  createdAt: number;
  extension?: string;
  isBinary?: boolean;
  gitStatus?: GitStatus;
  children?: FileSystemNode[];
}

export type GitStatus = 'unmodified' | 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked' | 'ignored';

export interface TerminalSession {
  id: string;
  workspaceId: string;
  name: string;
  shell: string;
  cwd: string;
  createdAt: number;
  cols: number;
  rows: number;
}

export interface TerminalOutput {
  sessionId: string;
  data: string;
  timestamp: number;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface Settings {
  theme: ThemeMode;
  fontSize: number;
  fontFamily: string;
  terminalFontSize: number;
  terminalFontFamily: string;
  autoSave: boolean;
  autoSaveInterval: number;
  language: string;
  startupBehavior: StartupBehavior;
  telemetryEnabled: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
}

export type StartupBehavior = 'welcome' | 'last-workspace' | 'new-chat' | 'last-mode';

export interface ApiKeyEntry {
  id: string;
  providerId: string;
  keyName: string;
  encryptedKey: string;
  createdAt: number;
  lastValidated?: number;
  isValid: boolean;
}

export interface MCPServerConfig {
  id: string;
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  enabled: boolean;
  autoConnect: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  serverId: string;
}

// ============================================================================
// Governance Types
// ============================================================================

export interface GovernanceFiles {
  unsaved: UnsavedContent;
  rules: RulesContent;
  features: FeaturesContent;
  update: UpdateContent;
  flow: FlowContent;
}

export interface UnsavedContent {
  objective: string;
  analysis: string;
  affectedFiles: string[];
  proposedImplementation: string;
  dependencies: string[];
  risks: string[];
  expectedResults: string;
}

export interface RulesContent {
  rules: Rule[];
}

export interface Rule {
  number: number;
  title: string;
  description: string;
}

export interface FeaturesContent {
  modules: FeatureModule[];
}

export interface FeatureModule {
  id: string;
  name: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  description: string;
  status: FeatureStatus;
  acceptanceCriteria: string[];
  relevantFiles: string[];
  verificationStatus: VerificationStatus;
}

export type FeatureStatus = 'pending' | 'in-progress' | 'completed';
export type VerificationStatus = 'not-tested' | 'testing' | 'verified' | 'failed';

export interface UpdateContent {
  entries: UpdateEntry[];
}

export interface UpdateEntry {
  date: string;
  description: string;
  affectedFiles: string[];
  justification: string;
  implementation: string;
  dependencies: string[];
  compatibility: string;
  testing: string;
}

export interface FlowContent {
  activeObjective: string;
  projectContext: ProjectContext;
  currentFiles: CurrentFile[];
  completedWork: string[];
  pendingWork: string[];
  validation: ValidationStatus;
  blockers: Blocker[];
  nextActions: NextAction[];
}

export interface ProjectContext {
  frameworks: string[];
  languages: string[];
  architecture: string;
  implementationDetails: string;
}

export interface CurrentFile {
  path: string;
  functions: string[];
  components: string[];
}

export interface ValidationStatus {
  testsExecuted: string[];
  buildResults: string;
  knownFailures: string[];
}

export interface Blocker {
  description: string;
  type: 'missing-requirement' | 'decision-needed' | 'technical-issue' | 'external-dependency';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface NextAction {
  step: number;
  description: string;
  estimatedTime: string;
}

// ============================================================================
// IPC Types
// ============================================================================

export interface IPCChannel<TInput, TOutput> {
  name: string;
  input: TInput;
  output: TOutput;
}

export type IPCChannels = {
  // App lifecycle
  'app:ready': IPCChannel<void, { version: string; platform: string }>;
  'app:quit': IPCChannel<void, void>;
  'app:get-config': IPCChannel<void, AppConfig>;
  'app:set-config': IPCChannel<Partial<AppConfig>, AppConfig>;

  // Chatbot
  'chat:list-conversations': IPCChannel<void, Conversation[]>;
  'chat:create-conversation': IPCChannel<Partial<Conversation>, Conversation>;
  'chat:update-conversation': IPCChannel<{ id: string; updates: Partial<Conversation> }, Conversation>;
  'chat:delete-conversation': IPCChannel<string, void>;
  'chat:archive-conversation': IPCChannel<string, Conversation>;
  'chat:get-messages': IPCChannel<string, Message[]>;
  'chat:send-message': IPCChannel<{ conversationId: string; content: string | MessageContent[]; attachments?: FileData[] }, Message>;
  'chat:stream-message': IPCChannel<{ conversationId: string; content: string | MessageContent[]; modelId: string }, AsyncIterable<StreamChunk>>;
  'chat:cancel-stream': IPCChannel<string, void>;
  'chat:regenerate-message': IPCChannel<string, Message>;

  // Providers
  'providers:list': IPCChannel<void, AIProvider[]>;
  'providers:create': IPCChannel<Omit<AIProvider, 'id' | 'createdAt' | 'updatedAt'>, AIProvider>;
  'providers:update': IPCChannel<{ id: string; updates: Partial<AIProvider> }, AIProvider>;
  'providers:delete': IPCChannel<string, void>;
  'providers:test': IPCChannel<string, { success: boolean; error?: string }>;
  'providers:list-models': IPCChannel<string, AIModel[]>;

  // API Keys
  'keys:list': IPCChannel<void, ApiKeyEntry[]>;
  'keys:create': IPCChannel<Omit<ApiKeyEntry, 'id' | 'createdAt' | 'encryptedKey'> & { key: string }, ApiKeyEntry>;
  'keys:delete': IPCChannel<string, void>;
  'keys:validate': IPCChannel<string, { valid: boolean; error?: string }>;

  // Work Mode
  'workspace:select': IPCChannel<void, { path: string; name: string } | null>;
  'workspace:list-recent': IPCChannel<void, Workspace[]>;
  'workspace:open': IPCChannel<string, Workspace>;
  'workspace:close': IPCChannel<void, void>;
  'fs:read-dir': IPCChannel<string, FileSystemNode[]>;
  'fs:read-file': IPCChannel<string, { content: string; encoding: string }>;
  'fs:write-file': IPCChannel<{ path: string; content: string; encoding?: string }, void>;
  'fs:delete': IPCChannel<string, void>;
  'fs:rename': IPCChannel<{ oldPath: string; newPath: string }, void>;
  'fs:create-dir': IPCChannel<string, void>;
  'fs:watch': IPCChannel<string, void>;
  'fs:unwatch': IPCChannel<string, void>;

  // Terminal
  'terminal:create': IPCChannel<{ workspaceId: string; cwd?: string; cols: number; rows: number }, TerminalSession>;
  'terminal:resize': IPCChannel<{ sessionId: string; cols: number; rows: number }, void>;
  'terminal:write': IPCChannel<{ sessionId: string; data: string }, void>;
  'terminal:close': IPCChannel<string, void>;
  'terminal:on-data': IPCChannel<{ sessionId: string; data: string }, void>;
  'terminal:on-exit': IPCChannel<{ sessionId: string; code: number }, void>;

  // Settings
  'settings:get': IPCChannel<void, Settings>;
  'settings:set': IPCChannel<Partial<Settings>, Settings>;

  // MCP
  'mcp:list-servers': IPCChannel<void, MCPServerConfig[]>;
  'mcp:create-server': IPCChannel<Omit<MCPServerConfig, 'id' | 'createdAt' | 'updatedAt'>, MCPServerConfig>;
  'mcp:update-server': IPCChannel<{ id: string; updates: Partial<MCPServerConfig> }, MCPServerConfig>;
  'mcp:delete-server': IPCChannel<string, void>;
  'mcp:connect': IPCChannel<string, { success: boolean; tools: MCPTool[]; error?: string }>;
  'mcp:disconnect': IPCChannel<string, void>;
  'mcp:call-tool': IPCChannel<{ serverId: string; toolName: string; args: Record<string, unknown> }, unknown>;

  // Governance
  'governance:read': IPCChannel<string, string>;
  'governance:write': IPCChannel<{ file: string; content: string }, void>;
  'governance:watch': IPCChannel<string, void>;
  'governance:unwatch': IPCChannel<string, void>;
};

export interface StreamChunk {
  type: 'content' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content?: string;
  toolCall?: ToolCall;
  toolResult?: { toolCallId: string; result: unknown };
  error?: string;
  usage?: TokenUsage;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}