import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.exco API
Object.defineProperty(window, 'exco', {
  value: {
    app: {
      getConfig: vi.fn().mockResolvedValue({ mode: 'chatbot', theme: 'system', permissionLevel: 'ask' }),
      setConfig: vi.fn(),
    },
    chat: {
      listConversations: vi.fn().mockResolvedValue([]),
      createConversation: vi.fn(),
      updateConversation: vi.fn(),
      deleteConversation: vi.fn(),
      archiveConversation: vi.fn(),
      getMessages: vi.fn().mockResolvedValue([]),
      sendMessage: vi.fn(),
      streamMessage: vi.fn(),
      cancelStream: vi.fn(),
      regenerateMessage: vi.fn(),
    },
    providers: {
      list: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      test: vi.fn().mockResolvedValue({ success: true }),
      listModels: vi.fn().mockResolvedValue([]),
    },
    keys: {
      list: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
      delete: vi.fn(),
      validate: vi.fn().mockResolvedValue({ valid: true }),
    },
    workspace: {
      select: vi.fn().mockResolvedValue(null),
      listRecent: vi.fn().mockResolvedValue([]),
      open: vi.fn(),
      close: vi.fn(),
    },
    fs: {
      readDir: vi.fn().mockResolvedValue([]),
      readFile: vi.fn(),
      writeFile: vi.fn(),
      delete: vi.fn(),
      rename: vi.fn(),
      createDir: vi.fn(),
      watch: vi.fn(),
      unwatch: vi.fn(),
    },
    terminal: {
      create: vi.fn(),
      resize: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
    },
    settings: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn(),
    },
    mcp: {
      listServers: vi.fn().mockResolvedValue([]),
      createServer: vi.fn(),
      updateServer: vi.fn(),
      deleteServer: vi.fn(),
      connect: vi.fn().mockResolvedValue({ success: true, tools: [] }),
      disconnect: vi.fn(),
      callTool: vi.fn(),
    },
    governance: {
      read: vi.fn().mockResolvedValue(''),
      write: vi.fn(),
      watch: vi.fn(),
      unwatch: vi.fn(),
    },
  },
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: any) => arr.map(() => Math.floor(Math.random() * 256)),
  },
});