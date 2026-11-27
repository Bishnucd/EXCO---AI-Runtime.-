/**
 * EXCO Shared Constants
 * Application-wide constants and configuration values
 */

// ============================================================================
// Application Metadata
// ============================================================================

export const APP_NAME = 'EXCO';
export const APP_VERSION = '0.1.0';
export const APP_DESCRIPTION = 'Autonomous Engineering Intelligence Platform';
export const APP_AUTHOR = 'EXCO Team';
export const APP_COPYRIGHT = 'Copyright © 2026 EXCO Team';

// ============================================================================
// Window Configuration
// ============================================================================

export const WINDOW_DEFAULTS = {
  width: 1400,
  height: 900,
  minWidth: 1000,
  minHeight: 700,
  titleBarStyle: 'hidden' as const,
  trafficLightPosition: { x: 16, y: 16 },
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
    preload: '',
    spellcheck: false,
  },
};

export const WINDOW_TITLE = `${APP_NAME} — Autonomous Engineering Intelligence`;

// ============================================================================
// IPC Channel Names
// ============================================================================

export const IPC_CHANNELS = {
  // Window controls
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized',
  WINDOW_CLOSE: 'window:close',

  // App lifecycle
  APP_READY: 'app:ready',
  APP_QUIT: 'app:quit',
  APP_GET_CONFIG: 'app:get-config',
  APP_SET_CONFIG: 'app:set-config',

  // Chatbot
  CHAT_LIST_CONVERSATIONS: 'chat:list-conversations',
  CHAT_CREATE_CONVERSATION: 'chat:create-conversation',
  CHAT_UPDATE_CONVERSATION: 'chat:update-conversation',
  CHAT_DELETE_CONVERSATION: 'chat:delete-conversation',
  CHAT_ARCHIVE_CONVERSATION: 'chat:archive-conversation',
  CHAT_GET_MESSAGES: 'chat:get-messages',
  CHAT_SEND_MESSAGE: 'chat:send-message',
  CHAT_STREAM_MESSAGE: 'chat:stream-message',
  CHAT_CANCEL_STREAM: 'chat:cancel-stream',
  CHAT_REGENERATE_MESSAGE: 'chat:regenerate-message',

  // Providers
  PROVIDERS_LIST: 'providers:list',
  PROVIDERS_CREATE: 'providers:create',
  PROVIDERS_UPDATE: 'providers:update',
  PROVIDERS_DELETE: 'providers:delete',
  PROVIDERS_TEST: 'providers:test',
  PROVIDERS_LIST_MODELS: 'providers:list-models',

  // API Keys
  KEYS_LIST: 'keys:list',
  KEYS_CREATE: 'keys:create',
  KEYS_DELETE: 'keys:delete',
  KEYS_VALIDATE: 'keys:validate',

  // Work Mode
  WORKSPACE_SELECT: 'workspace:select',
  WORKSPACE_LIST_RECENT: 'workspace:list-recent',
  WORKSPACE_OPEN: 'workspace:open',
  WORKSPACE_CLOSE: 'workspace:close',
  FS_READ_DIR: 'fs:read-dir',
  FS_READ_FILE: 'fs:read-file',
  FS_WRITE_FILE: 'fs:write-file',
  FS_DELETE: 'fs:delete',
  FS_RENAME: 'fs:rename',
  FS_CREATE_DIR: 'fs:create-dir',
  FS_WATCH: 'fs:watch',
  FS_UNWATCH: 'fs:unwatch',

  // Terminal
  TERMINAL_CREATE: 'terminal:create',
  TERMINAL_RESIZE: 'terminal:resize',
  TERMINAL_WRITE: 'terminal:write',
  TERMINAL_CLOSE: 'terminal:close',
  TERMINAL_ON_DATA: 'terminal:on-data',
  TERMINAL_ON_EXIT: 'terminal:on-exit',

  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',

  // MCP
  MCP_LIST_SERVERS: 'mcp:list-servers',
  MCP_CREATE_SERVER: 'mcp:create-server',
  MCP_UPDATE_SERVER: 'mcp:update-server',
  MCP_DELETE_SERVER: 'mcp:delete-server',
  MCP_CONNECT: 'mcp:connect',
  MCP_DISCONNECT: 'mcp:disconnect',
  MCP_CALL_TOOL: 'mcp:call-tool',

  // Governance
  GOVERNANCE_READ: 'governance:read',
  GOVERNANCE_WRITE: 'governance:write',
  GOVERNANCE_WATCH: 'governance:watch',
  GOVERNANCE_UNWATCH: 'governance:unwatch',
} as const;

// ============================================================================
// Database Constants
// ============================================================================

export const DB_NAME = 'exco.db';
export const DB_VERSION = 1;

export const DB_TABLES = {
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  WORKSPACES: 'workspaces',
  SETTINGS: 'settings',
  API_KEYS: 'api_keys',
  PROVIDERS: 'providers',
  MODELS: 'models',
  MCP_SERVERS: 'mcp_servers',
  GOVERNANCE_FILES: 'governance_files',
} as const;

// ============================================================================
// File System Constants
// ============================================================================

export const EXCO_FOLDER_NAME = '.exco';
export const GOVERNANCE_FILES = [
  'unsaved.md',
  'rules.md',
  'features.md',
  'update.md',
  'flow.md',
] as const;

export const GOVERNANCE_FILE_PATHS = GOVERNANCE_FILES.map(f => `${EXCO_FOLDER_NAME}/${f}`);

export const MAX_FILE_SIZE_FOR_EDIT = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_FOR_PREVIEW = 1 * 1024 * 1024; // 1MB

export const WATCH_DEBOUNCE_MS = 300;

// ============================================================================
// Terminal Constants
// ============================================================================

export const DEFAULT_SHELLS = {
  win32: 'powershell.exe',
  darwin: '/bin/zsh',
  linux: '/bin/bash',
} as const;

export const TERMINAL_DEFAULTS = {
  cols: 120,
  rows: 30,
  scrollback: 10000,
  cursorBlink: true,
  fontSize: 13,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  theme: {
    background: '#0d1117',
    foreground: '#e6edf3',
    cursor: '#58a6ff',
    selection: 'rgba(88, 166, 255, 0.3)',
    black: '#484f58',
    red: '#ff7b72',
    green: '#3fb950',
    yellow: '#d29922',
    blue: '#58a6ff',
    magenta: '#bc8cff',
    cyan: '#39c5cf',
    white: '#e6edf3',
    brightBlack: '#6e7681',
    brightRed: '#ff9779',
    brightGreen: '#56d364',
    brightYellow: '#e3b341',
    brightBlue: '#79c0ff',
    brightMagenta: '#d2a8ff',
    brightCyan: '#56d4dd',
    brightWhite: '#f0f6fc',
  },
} as const;

// ============================================================================
// AI Provider Constants
// ============================================================================

export const PROVIDER_TYPES = [
  'anthropic',
  'openai',
  'google',
  'ollama',
  'openrouter',
  'custom',
] as const;

export const DEFAULT_MODELS = {
  anthropic: [
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', contextWindow: 200000, maxOutput: 8192 },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', contextWindow: 200000, maxOutput: 8192 },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', contextWindow: 200000, maxOutput: 8192 },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextWindow: 200000, maxOutput: 8192 },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000, maxOutput: 16384 },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextWindow: 128000, maxOutput: 16384 },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000, maxOutput: 4096 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16385, maxOutput: 4096 },
  ],
  google: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextWindow: 2000000, maxOutput: 8192 },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextWindow: 1000000, maxOutput: 8192 },
    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', contextWindow: 32768, maxOutput: 2048 },
  ],
  ollama: [
    { id: 'llama3.1:70b', name: 'Llama 3.1 70B', contextWindow: 128000, maxOutput: 4096 },
    { id: 'llama3.1:8b', name: 'Llama 3.1 8B', contextWindow: 128000, maxOutput: 4096 },
    { id: 'codellama:34b', name: 'Code Llama 34B', contextWindow: 16384, maxOutput: 4096 },
    { id: 'codellama:13b', name: 'Code Llama 13B', contextWindow: 16384, maxOutput: 4096 },
    { id: 'mistral:7b', name: 'Mistral 7B', contextWindow: 32768, maxOutput: 4096 },
  ],
} as const;

export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 4096;
export const DEFAULT_REASONING_EFFORT = 'medium';

// ============================================================================
// Settings Constants
// ============================================================================

export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  fontSize: 14,
  fontFamily: 'Inter, system-ui, sans-serif',
  terminalFontSize: 13,
  terminalFontFamily: 'JetBrains Mono, Fira Code, monospace',
  autoSave: true,
  autoSaveInterval: 2000,
  language: 'en',
  startupBehavior: 'welcome' as const,
  telemetryEnabled: false,
  compactMode: false,
  animationsEnabled: true,
};

export const SETTINGS_KEYS = {
  THEME: 'theme',
  FONT_SIZE: 'fontSize',
  FONT_FAMILY: 'fontFamily',
  TERMINAL_FONT_SIZE: 'terminalFontSize',
  TERMINAL_FONT_FAMILY: 'terminalFontFamily',
  AUTO_SAVE: 'autoSave',
  AUTO_SAVE_INTERVAL: 'autoSaveInterval',
  LANGUAGE: 'language',
  STARTUP_BEHAVIOR: 'startupBehavior',
  TELEMETRY_ENABLED: 'telemetryEnabled',
  COMPACT_MODE: 'compactMode',
  ANIMATIONS_ENABLED: 'animationsEnabled',
} as const;

// ============================================================================
// UI Constants
// ============================================================================

export const SIDEBAR_WIDTH = {
  collapsed: 64,
  expanded: 280,
  minWidth: 200,
  maxWidth: 400,
};

export const SETTINGS_DRAWER_WIDTH = 480;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
};

export const Z_INDEX = {
  dropdown: 100,
  modal: 200,
  toast: 300,
  tooltip: 400,
  sidebar: 500,
  settingsDrawer: 600,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  CONVERSATION_TITLE_MAX: 200,
  CONVERSATION_TITLE_MIN: 1,
  MESSAGE_CONTENT_MAX: 100000,
  PROVIDER_NAME_MAX: 100,
  PROVIDER_NAME_MIN: 1,
  API_KEY_NAME_MAX: 50,
  API_KEY_NAME_MIN: 1,
  MCP_SERVER_NAME_MAX: 100,
  MCP_SERVER_NAME_MIN: 1,
  WORKSPACE_NAME_MAX: 100,
  WORKSPACE_NAME_MIN: 1,
  FILE_NAME_MAX: 255,
  PATH_MAX: 4096,
} as const;

// ============================================================================
// Timeout Constants
// ============================================================================

export const TIMEOUTS = {
  IPC_REQUEST: 30000,
  STREAM_CHUNK: 60000,
  PROVIDER_CONNECT: 10000,
  PROVIDER_REQUEST: 120000,
  TERMINAL_START: 5000,
  FILE_OPERATION: 10000,
  DATABASE_OPERATION: 5000,
  AUTO_SAVE_DEBOUNCE: 2000,
  SEARCH_DEBOUNCE: 300,
} as const;

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  APP_CONFIG: 'exco:app-config',
  SETTINGS: 'exco:settings',
  RECENT_WORKSPACES: 'exco:recent-workspaces',
  WINDOW_STATE: 'exco:window-state',
  THEME: 'exco:theme',
} as const;

// ============================================================================
// Error Codes
// ============================================================================

export const ERROR_CODES = {
  // General
  UNKNOWN: 'UNKNOWN_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',

  // File System
  FS_NOT_FOUND: 'FS_NOT_FOUND',
  FS_PERMISSION_DENIED: 'FS_PERMISSION_DENIED',
  FS_ALREADY_EXISTS: 'FS_ALREADY_EXISTS',
  FS_INVALID_PATH: 'FS_INVALID_PATH',
  FS_OUT_OF_BOUNDS: 'FS_OUT_OF_BOUNDS',
  FS_TOO_LARGE: 'FS_TOO_LARGE',
  FS_BINARY_FILE: 'FS_BINARY_FILE',

  // Terminal
  TERMINAL_NOT_FOUND: 'TERMINAL_NOT_FOUND',
  TERMINAL_ALREADY_CLOSED: 'TERMINAL_ALREADY_CLOSED',
  TERMINAL_SPAWN_FAILED: 'TERMINAL_SPAWN_FAILED',

  // AI Providers
  PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
  PROVIDER_NOT_CONFIGURED: 'PROVIDER_NOT_CONFIGURED',
  PROVIDER_AUTH_FAILED: 'PROVIDER_AUTH_FAILED',
  PROVIDER_RATE_LIMITED: 'PROVIDER_RATE_LIMITED',
  PROVIDER_OVERLOADED: 'PROVIDER_OVERLOADED',
  PROVIDER_TIMEOUT: 'PROVIDER_TIMEOUT',
  PROVIDER_INVALID_REQUEST: 'PROVIDER_INVALID_REQUEST',
  PROVIDER_MODEL_NOT_FOUND: 'PROVIDER_MODEL_NOT_FOUND',
  PROVIDER_STREAM_ERROR: 'PROVIDER_STREAM_ERROR',

  // API Keys
  KEY_NOT_FOUND: 'KEY_NOT_FOUND',
  KEY_INVALID: 'KEY_INVALID',
  KEY_ENCRYPTION_FAILED: 'KEY_ENCRYPTION_FAILED',
  KEY_DECRYPTION_FAILED: 'KEY_DECRYPTION_FAILED',

  // MCP
  MCP_SERVER_NOT_FOUND: 'MCP_SERVER_NOT_FOUND',
  MCP_CONNECTION_FAILED: 'MCP_CONNECTION_FAILED',
  MCP_TOOL_NOT_FOUND: 'MCP_TOOL_NOT_FOUND',
  MCP_TOOL_EXECUTION_FAILED: 'MCP_TOOL_EXECUTION_FAILED',

  // Database
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  DB_MIGRATION_FAILED: 'DB_MIGRATION_FAILED',
  DB_CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION',

  // Governance
  GOVERNANCE_FILE_NOT_FOUND: 'GOVERNANCE_FILE_NOT_FOUND',
  GOVERNANCE_WRITE_FAILED: 'GOVERNANCE_WRITE_FAILED',
  GOVERNANCE_PARSE_FAILED: 'GOVERNANCE_PARSE_FAILED',
} as const;

// ============================================================================
// Event Names (for EventEmitter)
// ============================================================================

export const EVENTS = {
  // App
  APP_READY: 'app:ready',
  APP_QUIT: 'app:quit',
  APP_CONFIG_CHANGED: 'app:config-changed',

  // Chat
  CONVERSATION_CREATED: 'chat:conversation-created',
  CONVERSATION_UPDATED: 'chat:conversation-updated',
  CONVERSATION_DELETED: 'chat:conversation-deleted',
  CONVERSATION_ARCHIVED: 'chat:conversation-archived',
  MESSAGE_SENT: 'chat:message-sent',
  MESSAGE_STREAMING: 'chat:message-streaming',
  MESSAGE_COMPLETE: 'chat:message-complete',
  MESSAGE_ERROR: 'chat:message-error',

  // Workspace
  WORKSPACE_OPENED: 'workspace:opened',
  WORKSPACE_CLOSED: 'workspace:closed',
  FILE_CREATED: 'fs:file-created',
  FILE_UPDATED: 'fs:file-updated',
  FILE_DELETED: 'fs:file-deleted',
  FILE_RENAMED: 'fs:file-renamed',
  DIRECTORY_CREATED: 'fs:directory-created',

  // Terminal
  TERMINAL_CREATED: 'terminal:created',
  TERMINAL_DATA: 'terminal:data',
  TERMINAL_EXIT: 'terminal:exit',
  TERMINAL_RESIZED: 'terminal:resized',
  TERMINAL_CLOSED: 'terminal:closed',

  // Settings
  SETTINGS_CHANGED: 'settings:changed',
  THEME_CHANGED: 'theme:changed',

  // MCP
  MCP_SERVER_CONNECTED: 'mcp:server-connected',
  MCP_SERVER_DISCONNECTED: 'mcp:server-disconnected',
  MCP_TOOL_CALLED: 'mcp:tool-called',

  // Governance
  GOVERNANCE_FILE_CHANGED: 'governance:file-changed',
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

function internalJoinPath(...parts: string[]): string {
  return parts.map(p => p.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
}

export function getExcoFolderPath(workspacePath: string): string {
  return internalJoinPath(workspacePath, EXCO_FOLDER_NAME);
}

export function getGovernanceFilePath(workspacePath: string, filename: string): string {
  return internalJoinPath(getExcoFolderPath(workspacePath), filename);
}

export function getDbPath(appDataPath: string): string {
  return internalJoinPath(appDataPath, DB_NAME);
}

export function getDefaultShell(): string {
  const platform = process.platform;
  if (platform === 'win32') return DEFAULT_SHELLS.win32;
  if (platform === 'darwin') return DEFAULT_SHELLS.darwin;
  return DEFAULT_SHELLS.linux;
}