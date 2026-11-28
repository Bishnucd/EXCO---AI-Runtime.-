/**
 * EXCO IPC Handlers
 * Main process IPC channel handlers with validation and error handling
 */

import { ipcMain, dialog, app, shell, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';
import {
  validateInput,
  appConfigSchema,
  createConversationInputSchema,
  updateConversationInputSchema,
  createProviderInputSchema,
  updateProviderInputSchema,
  createApiKeyInputSchema,
  settingsSchema,
  createMcpServerInputSchema,
  updateMcpServerInputSchema,
  fileSystemNodeSchema,
} from '@shared/schemas';
import {
  AppConfig,
  Conversation,
  Message,
  AIProvider,
  ApiKeyEntry,
  Settings,
  MCPServerConfig,
  FileSystemNode,
  Workspace,
  TerminalSession,
  StreamChunk,
  IPCChannels,
} from '@shared/types';
import {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  createConversation,
  getConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  archiveConversation,
  restoreConversation,
  createMessage,
  getMessages,
  updateMessage,
  deleteMessagesByConversation,
  createWorkspace,
  getWorkspace,
  getWorkspaceByPath,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  getSetting,
  setSetting,
  getSettings,
  updateSettings,
  createApiKey,
  getApiKeys,
  getApiKey,
  deleteApiKey,
  updateApiKeyValidation,
  createProvider,
  getProviders,
  getProvider,
  getEnabledProviders,
  updateProvider,
  deleteProvider,
  createMcpServer,
  getMcpServers,
  getMcpServer,
  updateMcpServer,
  deleteMcpServer,
  getGovernanceFile,
  setGovernanceFile,
  getAllGovernanceFiles,
  deleteGovernanceFiles,
  getTokenUsageByModel,
} from '@main/database';
import {
  encrypt,
  decrypt,
  storeApiKey,
  getApiKey as getStoredApiKey,
  deleteApiKey as deleteStoredApiKey,
  initializeVault,
  getVaultStatus,
} from '@main/services/credential-vault';
import {
  generateId,
  now,
  isPathWithin,
  normalizePath,
  getDefaultShell,
  inferProviderFromApiKey,
  resolveApiKeyProfile,
  inferModelTier,
  computeModelBenchmarks,
  scoreModelForWorkflowCategory,
  type ModelCategory,
  serializeVoiceSession,
  stripVoiceSessionMarkerForContext,
} from '@shared/utils';
import type { VoiceSessionPayload } from '@shared/types';
import { EXCO_FOLDER_NAME, GOVERNANCE_FILES, TIMEOUTS, ERROR_CODES, IPC_CHANNELS, MAX_FILE_SIZE_FOR_EDIT } from '@shared/constants';
import { providerManager } from '@main/services/ai-providers';
import {
  runWorkspaceAgent,
  resolveWorkspaceApproval,
  cancelWorkspaceAgent,
  cancelWorkspaceAgentByConversation,
  type ApprovalDecision,
} from '@main/services/workspace-agent';
import {
  collectAllModelCandidates,
  getModelQualityTier,
  invalidateCandidatePoolCache,
  isAuthError,
  markKeyAuthFailed,
  routeTurnWithOverviewer,
  markModelExhausted,
  isQuotaOrModelUnavailableError,
  checkKeyPaidAccess,
  type RoutedCandidate,
} from '@main/services/model-router';
import {
  syncSkillOverrides,
  searchActiveSkills,
  getActiveSkills,
  buildUniversalSkillsPrompt,
} from '@main/services/skills-registry';
import {
  createMCPClient,
  getMCPClient,
  connectMCPServer,
  disconnectMCPServer,
  callMCPTool,
} from '@main/services/mcp/client';

async function resolveKeySecretForRouter(match: ApiKeyEntry): Promise<string | null> {
  const k = await getStoredApiKey(match.providerId, match.keyName);
  if (k) return k;
  if (match.encryptedKey && !match.encryptedKey.startsWith('encrypted:')) {
    try {
      return await decrypt(match.encryptedKey);
    } catch {}
  }
  return null;
}

// ============================================================================
// State Management
// ============================================================================

let currentConfig: AppConfig = {
  mode: 'chatbot',
  theme: 'system',
  permissionLevel: 'ask',
  recentWorkspaces: [],
};

let activeWorkspace: Workspace | null = null;
let allowedWorkspacePaths: string[] = [];
let terminalSessions: Map<string, { pty: any; session: TerminalSession }> = new Map();
let fileWatchers: Map<string, fsSync.FSWatcher> = new Map();
let activeStreamAbortControllers: Map<string, AbortController> = new Map();
const activeChatAbortControllers: Map<string, Set<AbortController>> = new Map();
const activeVoiceAbortControllers: Map<string, AbortController> = new Map();
const deletedConversationIds: Set<string> = new Set();

// Persistent warm MsEdgeTTS client to avoid 3-5s cold WebSocket handshakes on every sentence
let sharedEdgeTtsClient: any = null;
let sharedEdgeTtsVoice = '';
let edgeTtsChain: Promise<any> = Promise.resolve();

// In-memory LRU audio cache for short phrases & previews (returns in <1ms)
interface CachedTtsEntry {
  audioBase64: string;
  mimeType: string;
  source: string;
}
const TTS_CACHE_MAX_ENTRIES = 80;
const ttsAudioCache = new Map<string, CachedTtsEntry>();

function getCachedTtsAudio(key: string): CachedTtsEntry | undefined {
  const hit = ttsAudioCache.get(key);
  if (!hit) return undefined;
  // Refresh LRU order
  ttsAudioCache.delete(key);
  ttsAudioCache.set(key, hit);
  return hit;
}

function setCachedTtsAudio(key: string, entry: CachedTtsEntry): void {
  if (!key || !entry.audioBase64) return;
  if (ttsAudioCache.has(key)) ttsAudioCache.delete(key);
  ttsAudioCache.set(key, entry);
  if (ttsAudioCache.size > TTS_CACHE_MAX_ENTRIES) {
    const oldestKey = ttsAudioCache.keys().next().value;
    if (oldestKey) ttsAudioCache.delete(oldestKey);
  }
}

async function warmEdgeTtsClient(voiceName?: string): Promise<boolean> {
  const task = edgeTtsChain.then(async () => {
    try {
      const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
      const targetVoice = (voiceName && voiceName.includes('Neural') ? voiceName : 'en-US-AvaNeural').trim();
      if (sharedEdgeTtsClient && sharedEdgeTtsVoice === targetVoice) {
        return true;
      }
      if (sharedEdgeTtsClient) {
        try { sharedEdgeTtsClient.close?.(); } catch {}
        sharedEdgeTtsClient = null;
        sharedEdgeTtsVoice = '';
      }
      sharedEdgeTtsClient = new MsEdgeTTS({ connectionTimeoutMs: 2400, synthesisTimeoutMs: 4200 });
      await sharedEdgeTtsClient.setMetadata(targetVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      sharedEdgeTtsVoice = targetVoice;
      return true;
    } catch {
      try { sharedEdgeTtsClient?.close?.(); } catch {}
      sharedEdgeTtsClient = null;
      sharedEdgeTtsVoice = '';
      return false;
    }
  });
  edgeTtsChain = task.catch(() => false);
  return task;
}

async function runEdgeTtsSynthesis(text: string, voiceName?: string): Promise<{ audioBase64: string; mimeType: string; source: string } | null> {
  const task = edgeTtsChain.then(async () => {
    const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
    const targetVoice = (voiceName && voiceName.includes('Neural') ? voiceName : 'en-US-AvaNeural').trim();
    const escapedText = text
      .slice(0, 4000)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    try {
      // Recreate client when switching voices so metadata setup never stalls on a prior socket
      if (sharedEdgeTtsClient && sharedEdgeTtsVoice !== targetVoice) {
        try { sharedEdgeTtsClient.close?.(); } catch {}
        sharedEdgeTtsClient = null;
        sharedEdgeTtsVoice = '';
      }
      if (!sharedEdgeTtsClient) {
        sharedEdgeTtsClient = new MsEdgeTTS({ connectionTimeoutMs: 2400, synthesisTimeoutMs: 4200 });
        await sharedEdgeTtsClient.setMetadata(targetVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
        sharedEdgeTtsVoice = targetVoice;
      }
      const { audioStream } = sharedEdgeTtsClient.toStream(escapedText);
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const combined = Buffer.concat(chunks);
      if (combined.length > 0) {
        return {
          audioBase64: combined.toString('base64'),
          mimeType: 'audio/mpeg',
          source: 'edge-neural',
        };
      }
    } catch (err: any) {
      console.warn(`[TTS] Edge Neural (${targetVoice}):`, err?.message || err);
      try { sharedEdgeTtsClient?.close?.(); } catch {}
      sharedEdgeTtsClient = null;
      sharedEdgeTtsVoice = '';
    }
    return null;
  });
  edgeTtsChain = task.catch(() => null);
  return task;
}

function isConversationAbortedOrDeleted(conversationId: string, signal?: AbortSignal): boolean {
  if (!conversationId) return true;
  if (signal?.aborted) return true;
  if (deletedConversationIds.has(conversationId)) return true;
  return !getConversation(conversationId);
}

// ============================================================================
// Helper Functions
// ============================================================================

export function sendToRenderer(channel: string, data: unknown): void {
  // In a real implementation, this would send to the focused window
  // For now, we'll use a global reference set in main.ts
  if (global.mainWindow && !global.mainWindow.isDestroyed()) {
    global.mainWindow.webContents.send(channel, data);
  }
}

function addAllowedWorkspacePath(dirPath: string): void {
  const resolved = path.resolve(dirPath);
  if (!allowedWorkspacePaths.some(existing => isPathWithin(existing, resolved) && isPathWithin(resolved, existing))) {
    allowedWorkspacePaths.push(resolved);
  }
}

function resolveSafeRealPath(targetPath: string): string {
  const resolved = path.resolve(targetPath);
  try {
    return fsSync.realpathSync.native(resolved);
  } catch {
    const parent = path.dirname(resolved);
    try {
      return path.join(fsSync.realpathSync.native(parent), path.basename(resolved));
    } catch {
      return resolved;
    }
  }
}

function validateWorkspaceAccess(targetPath: string): boolean {
  if (!targetPath || typeof targetPath !== 'string') return false;
  const canonicalTarget = resolveSafeRealPath(targetPath);
  if (allowedWorkspacePaths.some(root => isPathWithin(resolveSafeRealPath(root), canonicalTarget))) {
    return true;
  }
  if (!activeWorkspace) return false;
  return isPathWithin(resolveSafeRealPath(activeWorkspace.path), canonicalTarget);
}

function sanitizeProviderForIpc(provider: AIProvider): AIProvider {
  if (!provider || !provider.config || typeof provider.config !== 'object') return provider;
  const { apiKey: _dropped, ...safeConfig } = provider.config as Record<string, any>;
  return { ...provider, config: safeConfig };
}

function sanitizeApiKeyForIpc(entry: ApiKeyEntry): ApiKeyEntry {
  return { ...entry, encryptedKey: '' };
}

async function ensureExcoFolder(workspacePath: string): Promise<string> {
  const excoPath = path.join(workspacePath, EXCO_FOLDER_NAME);
  try {
    await fs.mkdir(excoPath, { recursive: true });
  } catch {
    // Folder might already exist
  }
  return excoPath;
}

const probeMissCache = new Map<string, number>();
const PROBE_MISS_TTL_MS = 5 * 60 * 1000;

async function probeEndpointForUnknownKey(secret: string): Promise<ReturnType<typeof resolveApiKeyProfile> | null> {
  const cacheKey = secret.slice(0, 20);
  const missAt = probeMissCache.get(cacheKey);
  if (missAt && Date.now() - missAt < PROBE_MISS_TTL_MS) {
    return null;
  }
  const probes: Array<{
    providerId: 'custom' | 'openrouter' | 'openai' | 'anthropic' | 'google' | 'ollama';
    displayName: string;
    baseUrl: string;
    testUrl: string;
    headers: Record<string, string>;
    tier: 'free' | 'paid';
  }> = [
    {
      providerId: 'custom',
      displayName: 'FreeLLMAPI Gateway',
      baseUrl: 'http://127.0.0.1:31415/v1',
      testUrl: 'http://127.0.0.1:31415/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
    {
      providerId: 'openrouter',
      displayName: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api',
      testUrl: 'https://openrouter.ai/api/v1/auth/key',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'paid',
    },
    {
      providerId: 'custom',
      displayName: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com/v1',
      testUrl: 'https://api.deepseek.com/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'paid',
    },
    {
      providerId: 'custom',
      displayName: 'Mistral AI',
      baseUrl: 'https://api.mistral.ai/v1',
      testUrl: 'https://api.mistral.ai/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
    {
      providerId: 'custom',
      displayName: 'Together AI',
      baseUrl: 'https://api.together.xyz/v1',
      testUrl: 'https://api.together.xyz/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'paid',
    },
    {
      providerId: 'custom',
      displayName: 'Fireworks AI',
      baseUrl: 'https://api.fireworks.ai/inference/v1',
      testUrl: 'https://api.fireworks.ai/inference/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'paid',
    },
    {
      providerId: 'custom',
      displayName: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      testUrl: 'https://api.groq.com/openai/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
    {
      providerId: 'custom',
      displayName: 'Cerebras',
      baseUrl: 'https://api.cerebras.ai/v1',
      testUrl: 'https://api.cerebras.ai/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
    {
      providerId: 'openai',
      displayName: 'OpenAI',
      baseUrl: 'https://api.openai.com',
      testUrl: 'https://api.openai.com/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'paid',
    },
    {
      providerId: 'custom',
      displayName: 'LLM7 Gateway',
      baseUrl: 'https://api.llm7.io/v1',
      testUrl: 'https://api.llm7.io/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
    {
      providerId: 'custom',
      displayName: 'Aion Labs',
      baseUrl: 'https://api.aionlabs.ai/v1',
      testUrl: 'https://api.aionlabs.ai/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
    {
      providerId: 'custom',
      displayName: 'Parallel AI',
      baseUrl: 'https://api.parallel.ai/v1',
      testUrl: 'https://api.parallel.ai/v1/models',
      headers: { Authorization: `Bearer ${secret}` },
      tier: 'free',
    },
  ];

  const results = await Promise.all(
    probes.map(async candidate => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      try {
        const resp = await fetch(candidate.testUrl, { headers: candidate.headers, signal: controller.signal });
        if (resp.ok) {
          return {
            providerId: candidate.providerId,
            displayName: candidate.displayName,
            baseUrl: candidate.baseUrl,
            tier: candidate.tier,
          };
        }
      } catch {
      } finally {
        clearTimeout(timer);
      }
      return null;
    })
  );

  const hit = results.find(Boolean) || null;
  if (!hit) {
    probeMissCache.set(cacheKey, Date.now());
  }
  return hit;
}

/**
 * Automatically creates or updates a matching AIProvider record (using keyName as provider name,
 * resolved type, auto baseUrl, and live fetched models) whenever an API key is created or loaded.
 */
async function ensureProviderForKey(
  secret: string,
  requestedProvider?: string,
  keyName?: string,
  fetchModels = false
): Promise<{ profile: ReturnType<typeof resolveApiKeyProfile>; dbProvider: AIProvider | null }> {
  let profile = resolveApiKeyProfile(secret, requestedProvider, keyName);
  if (!secret) return { profile, dbProvider: null };

  // If still missing a baseUrl on an unfamiliar key format, probe common API endpoints automatically
  if (!profile.baseUrl) {
    const probed = await probeEndpointForUnknownKey(secret);
    if (probed) {
      profile = probed;
    }
  }

  const targetBase = (profile.baseUrl || '').trim().replace(/\/+$/, '').toLowerCase();
  const desiredName = keyName && keyName.trim() ? keyName.trim() : profile.displayName;
  const existingProviders = getProviders();

  let matching = existingProviders.find(p => {
    if (keyName && p.name && p.name.trim().toLowerCase() === keyName.trim().toLowerCase()) {
      return true;
    }
    const pBase = (p.config?.baseUrl || '').trim().replace(/\/+$/, '').toLowerCase();
    if (targetBase && pBase === targetBase && (!keyName || p.name === profile.displayName || p.name === p.type)) {
      return true;
    }
    if (profile.providerId !== 'custom' && p.type === profile.providerId && (!keyName || p.name === profile.displayName || p.name === p.type)) {
      return true;
    }
    return false;
  });

  if (!matching) {
    matching = createProvider({
      name: desiredName,
      type: profile.providerId,
      config: {
        baseUrl: profile.baseUrl || undefined,
      },
      models: [],
      enabled: true,
    });
    providerManager.registerConfiguredProvider(matching);
    const liveInst = providerManager.getProvider(matching.id);
    if (liveInst) liveInst.updateConfig({ apiKey: secret });
  } else {
    const existingBase = (matching.config?.baseUrl || '').trim();
    const keyHintL = (desiredName || '').toLowerCase();
    const isNvidiaKey = secret.trim().startsWith('nvapi-') || keyHintL.includes('nvidia') || keyHintL.includes('nim');
    const isOpenRouterKey = secret.trim().startsWith('sk-or-') || keyHintL.includes('openrouter') || keyHintL.includes('open router');
    const wasMisroutedToNvidia = existingBase.replace(/\/+$/, '') === 'https://integrate.api.nvidia.com/v1' && !isNvidiaKey;
    const wasMisroutedToOpenRouter = matching.type === 'openrouter' && !isOpenRouterKey;
    const needsGoogleV1BetaFix = profile.providerId === 'google' && existingBase.replace(/\/+$/, '') === 'https://generativelanguage.googleapis.com';
    const nextName = desiredName || matching.name;
    const nextBase = needsGoogleV1BetaFix
      ? profile.baseUrl
      : wasMisroutedToNvidia
      ? profile.baseUrl || undefined
      : existingBase || profile.baseUrl || undefined;
    const needsTypeFix = (matching.type !== profile.providerId && profile.providerId !== 'custom') || wasMisroutedToOpenRouter;
    if (matching.name !== nextName || !existingBase || needsTypeFix || needsGoogleV1BetaFix || wasMisroutedToNvidia) {
      const updated = updateProvider(matching.id, {
        name: nextName,
        type: needsTypeFix ? profile.providerId : matching.type,
        config: {
          ...matching.config,
          baseUrl: nextBase,
        },
        ...(wasMisroutedToNvidia ? { models: [] } : {}),
        enabled: true,
      });
      if (updated) matching = updated;
    }
    providerManager.registerConfiguredProvider(matching);
    const liveInst = providerManager.getProvider(matching.id);
    if (liveInst) liveInst.updateConfig({ apiKey: secret });
  }

  if (matching && !profile.baseUrl?.includes('elevenlabs.io') && (fetchModels || !Array.isArray(matching.models) || matching.models.length === 0)) {
    try {
      const inst = providerManager.getProvider(matching.id);
      if (inst) {
        inst.updateConfig({
          apiKey: secret,
          ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
        });
        const liveModels = await inst.listModels();
        const modelsToSave =
          liveModels.length > 0
            ? liveModels
            : profile.defaultModel
            ? [{
                id: profile.defaultModel,
                name: profile.defaultModel,
                providerId: matching.id,
                capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
                contextWindow: 128000,
                maxOutputTokens: 8192,
                supportsStreaming: true,
                supportsTools: true,
                supportsVision: false,
                supportsReasoning: false,
                tier: profile.tier,
              }]
            : [];
        if (modelsToSave.length > 0) {
          const updatedWithModels = updateProvider(matching.id, { models: modelsToSave });
          if (updatedWithModels) {
            matching = updatedWithModels;
            providerManager.registerConfiguredProvider(matching);
          }
        }
      }
    } catch {}
  }

  return { profile, dbProvider: matching || null };
}

// ============================================================================
// App Lifecycle Handlers
// ============================================================================

export function registerAppHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.APP_READY, async () => {
    return { version: app.getVersion(), platform: process.platform };
  });

  ipcMain.handle(IPC_CHANNELS.APP_QUIT, async () => {
    app.quit();
  });

  ipcMain.handle(IPC_CHANNELS.APP_GET_CONFIG, async () => {
    return currentConfig;
  });

  ipcMain.handle(IPC_CHANNELS.APP_SET_CONFIG, async (_event, updates: Partial<AppConfig>) => {
    currentConfig = { ...currentConfig, ...updates };
    return currentConfig;
  });

  ipcMain.handle('app:open-external', async (_event, rawUrl: string) => {
    const clean = (rawUrl || '').trim();
    if (!/^https?:\/\//i.test(clean)) return false;
    await shell.openExternal(clean);
    return true;
  });
}

// ============================================================================
// Chatbot Handlers
// ============================================================================

// Fast STT engine memory & Voice session sticky model lock (prevents per-turn routing & Overviewer churn)
let lastWorkingSttEngine: 'groq' | 'openai' | 'gemini' | null = null;
const sttEngineCooldownUntil = new Map<string, number>();

interface StickyVoiceSessionState {
  requestedModel: string;
  requestedKeyId: string;
  lockedCandidate: RoutedCandidate;
  orderedBackups: RoutedCandidate[];
  updatedAt: number;
}
const activeVoiceStickyModels = new Map<string, StickyVoiceSessionState>();

function isSttInCooldown(engine: string): boolean {
  const until = sttEngineCooldownUntil.get(engine);
  return Boolean(until && Date.now() < until);
}

function markSttCooldown(engine: string): void {
  sttEngineCooldownUntil.set(engine, Date.now() + 90_000);
  if (lastWorkingSttEngine === engine) {
    lastWorkingSttEngine = null;
  }
}

export function registerChatHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.CHAT_LIST_CONVERSATIONS, async () => {
    return getConversations(false).filter(c => {
      const t = String(c?.title || '');
      return !t.startsWith('[Work] ') && !t.startsWith('Work: ');
    });
  });

  ipcMain.handle('work:list-conversations', async () => {
    return getConversations(false)
      .filter(c => {
        const t = String(c?.title || '');
        return t.startsWith('[Work] ') || t.startsWith('Work: ');
      })
      .map(c => ({
        ...c,
        title: String(c.title || '').replace(/^(\[Work\]\s*|Work:\s*)/i, '') || 'Work Chat',
      }));
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_CREATE_CONVERSATION, async (_event, input) => {
    const validated = validateInput(createConversationInputSchema, input);
    return createConversation(validated as any);
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_UPDATE_CONVERSATION, async (_event, { id, updates }) => {
    const validated = validateInput(updateConversationInputSchema, { id, updates });
    return updateConversation(validated.id, validated.updates);
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_DELETE_CONVERSATION, async (_event, id) => {
    if (id) {
      deletedConversationIds.add(id);
      if (deletedConversationIds.size > 500) {
        const first = deletedConversationIds.values().next().value;
        if (first) deletedConversationIds.delete(first);
      }

      // Immediately abort any in-flight chat requests (Overviewer or main completion) for this conversation
      const controllers = activeChatAbortControllers.get(id);
      if (controllers) {
        for (const ctrl of controllers) {
          try {
            ctrl.abort();
          } catch {}
        }
        activeChatAbortControllers.delete(id);
      }

      // Abort any active stream for messages belonging to this conversation
      try {
        const msgs = getMessages(id);
        for (const msg of msgs) {
          const streamCtrl = activeStreamAbortControllers.get(msg.id);
          if (streamCtrl) {
            try {
              streamCtrl.abort();
            } catch {}
            activeStreamAbortControllers.delete(msg.id);
          }
        }
      } catch {}

      // Also abort any Work Agent running on this conversation
      cancelWorkspaceAgentByConversation(id);
    }

    // Also delete associated messages
    deleteMessagesByConversation(id);
    return deleteConversation(id);
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_ARCHIVE_CONVERSATION, async (_event, id) => {
    return archiveConversation(id);
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_GET_MESSAGES, async (_event, conversationId) => {
    return getMessages(conversationId);
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_SEND_MESSAGE, async (_event, { conversationId, content, attachments, modelId: requestedModel, providerId: requestedProvider, keyId, preferredFailover, workflowMode, skillContext }) => {
    if (isConversationAbortedOrDeleted(conversationId)) {
      return { aborted: true, userMessage: null as any, assistantMessage: null as any };
    }

    const normalizedContent = Array.isArray(attachments) && attachments.length > 0 && typeof content === 'string'
      ? [
          ...(content.trim() ? [{ type: 'text', text: content }] : []),
          ...attachments,
        ]
      : content;

    // Create user message
    const userMessage = createMessage({
      conversationId,
      role: 'user',
      content: normalizedContent,
      status: 'complete',
    });

    const abortController = new AbortController();
    let ctrlSet = activeChatAbortControllers.get(conversationId);
    if (!ctrlSet) {
      ctrlSet = new Set();
      activeChatAbortControllers.set(conversationId, ctrlSet);
    }
    ctrlSet.add(abortController);

    try {
      const conv = getConversation(conversationId);
      const isAutoRequested = !requestedModel || requestedModel === 'auto' || requestedModel === 'default';
      let modelId = isAutoRequested ? 'auto' : requestedModel;
      let providerId = requestedProvider || (conv?.providerId && conv.providerId !== 'default' ? conv.providerId : '');

      const emitStatus = (statusText: string, extra: Record<string, any> = {}) => {
        sendToRenderer('chat:live-progress', {
          conversationId,
          type: 'status',
          statusText,
          ...extra,
        });
      };

      emitStatus('Checking available keys & models...');
      const allKeys = getApiKeys();
      const pool = await collectAllModelCandidates(allKeys, resolveKeySecretForRouter, abortController.signal);

      if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
        return { aborted: true, userMessage: null as any, assistantMessage: null as any };
      }

      if (pool.length === 0) {
        const assistantMessage = createMessage({
          conversationId,
          role: 'assistant',
          content: `⚠️ **API Key Required**: Please use the **API Keys** button in the **Sidebar** to add and name your API key.`,
          modelId: 'No API Key',
          providerId: 'none',
          status: 'complete',
        });
        return { userMessage, assistantMessage };
      }

      const partsList = Array.isArray(normalizedContent) ? normalizedContent : [];
      const promptText = typeof normalizedContent === 'string'
        ? normalizedContent
        : partsList
            .map((p: any) => p?.text || p?.fileData?.textContent || p?.fileData?.name || '')
            .join(' ');
      const hasHeavyAttachments = partsList.some(
        (p: any) =>
          p?.type === 'image' ||
          (p?.type === 'file' && (p?.fileData?.mimeType === 'application/pdf' || (p?.fileData?.textContent?.length || 0) > 600))
      );
      const hasAnyAttachment = partsList.some((p: any) => p?.type === 'image' || p?.type === 'file');

      const activeWorkflow: ModelCategory =
        workflowMode === 'turbo' || workflowMode === 'standard' || workflowMode === 'deep-thought'
          ? workflowMode
          : 'standard';

      const decision = await routeTurnWithOverviewer({
        pool,
        promptText,
        requestedModel: modelId,
        preferredKeyId: keyId,
        workflowMode: activeWorkflow,
        reasoningEffort: conv?.reasoningEffort,
        hasHeavyAttachments,
        hasAnyAttachment,
        preferredFailover: preferredFailover !== false,
        signal: abortController.signal,
        onStatus: msg => emitStatus(msg),
      });

      if (isConversationAbortedOrDeleted(conversationId, abortController.signal) || !decision) {
        return { aborted: true, userMessage: null as any, assistantMessage: null as any };
      }

      const taskLabel =
        activeWorkflow === 'deep-thought'
          ? 'Deep Thought'
          : activeWorkflow === 'turbo'
          ? 'Turbo'
          : 'Standard';

      // Inform renderer immediately which category & top Overview model was selected
      sendToRenderer('chat:live-progress', {
        conversationId,
        type: 'routing',
        taskType: decision.taskType,
        modelId: decision.selected.modelId,
        providerId: decision.selected.providerId,
        overviewerModelId: decision.overviewerUsed?.modelId,
        statusText: `Selected ${decision.selected.modelId} (${taskLabel}) — generating reply...`,
      });

      // Preserve exact router priority: same best model across other API keys before next-best model
      const candidatesToTry: RoutedCandidate[] = decision.candidates;
      let assistantContent = '';
      let tokens: any = undefined;
      let failoverTransitionNote = '';
      const initialCandidate = decision.selected;
      let usedModelId = initialCandidate.modelId;
      let usedProviderId = initialCandidate.providerId;
      let failoverCount = 0;

      // Skip remaining candidates sharing an unauthorized key and switch silently in background
      const failedAuthKeys = new Set<string>();
      for (let attempt = 0; attempt < candidatesToTry.length && attempt < 10; attempt++) {
        if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
          return { aborted: true, userMessage: null as any, assistantMessage: null as any };
        }

        const cand = candidatesToTry[attempt];
        if (failedAuthKeys.has(cand.keyId)) continue;
        const profile = resolveApiKeyProfile(cand.keySecret, cand.providerId, cand.keyName);
        let endpointHost = cand.providerDisplayName;
        try {
          if (profile.baseUrl) endpointHost = new URL(profile.baseUrl).host;
        } catch {}

        if (attempt > 0) {
          emitStatus(
            `Routing via ${cand.modelId} (${endpointHost})...`,
            { modelId: cand.modelId, providerId: cand.providerId }
          );
        }

        const provider = providerManager.getProviderForKeyProfile(cand.providerId, cand.keySecret);
        if (provider) {
          provider.updateConfig({
            apiKey: cand.keySecret,
            ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
          });
        }

        const history = getMessages(conversationId);
        if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
          return { aborted: true, userMessage: null as any, assistantMessage: null as any };
        }

        const targetProviderKey = provider ? provider.getId() : cand.providerId;
        const attemptTimeoutMs = candidatesToTry.length > attempt + 1 ? 15000 : 35000;
        const attemptCtrl = new AbortController();
        const onParentAbort = () => attemptCtrl.abort();
        if (abortController.signal.aborted) {
          attemptCtrl.abort();
        } else {
          abortController.signal.addEventListener('abort', onParentAbort, { once: true });
        }

        const attemptStartedAt = Date.now();
        let attemptTimedOut = false;
        let streamedChars = 0;
        let reasoningChars = 0;
        let receivedAnyChunk = false;
        let lastStatusEmit = 0;

        emitStatus(
          `Connecting to ${cand.providerDisplayName} (${endpointHost}) · ${cand.modelId}...`,
          { modelId: cand.modelId, providerId: cand.providerId }
        );

        const heartbeat = setInterval(() => {
          if (attemptCtrl.signal.aborted || isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
            return;
          }
          const elapsedSec = Math.max(1, Math.round((Date.now() - attemptStartedAt) / 1000));
          if (streamedChars > 0) {
            emitStatus(`Streaming from ${cand.modelId} (${streamedChars} chars · ${elapsedSec}s)...`, {
              modelId: cand.modelId,
              providerId: cand.providerId,
            });
          } else if (reasoningChars > 0) {
            emitStatus(`Reasoning in ${cand.modelId} (${reasoningChars} chars · ${elapsedSec}s)...`, {
              modelId: cand.modelId,
              providerId: cand.providerId,
            });
          } else {
            emitStatus(`Awaiting ${cand.providerDisplayName} (${cand.modelId}) · ${elapsedSec}s...`, {
              modelId: cand.modelId,
              providerId: cand.providerId,
            });
          }
        }, 1000);

        const attemptTimer = setTimeout(() => {
          attemptTimedOut = true;
          attemptCtrl.abort();
        }, attemptTimeoutMs);

        try {
          const universalSkillSystem = buildUniversalSkillsPrompt(promptText, skillContext);
          let streamedContent = '';
          let streamedUsage: any = undefined;
          let streamErroredBeforeContent = false;

          try {
            await new Promise<void>((resolve, reject) => {
              let settled = false;
              const finish = (err?: any) => {
                if (settled) return;
                settled = true;
                if (err) reject(err);
                else resolve();
              };

              providerManager
                .streamComplete(
                  targetProviderKey,
                  {
                    model: cand.modelId,
                    messages: history,
                    systemPrompt: universalSkillSystem,
                    signal: attemptCtrl.signal,
                  },
                  {
                    onReasoning: (rDelta: string) => {
                      if (!rDelta || attemptCtrl.signal.aborted) return;
                      receivedAnyChunk = true;
                      reasoningChars += rDelta.length;
                      const nowMs = Date.now();
                      if (nowMs - lastStatusEmit > 500) {
                        lastStatusEmit = nowMs;
                        const sec = Math.max(1, Math.round((nowMs - attemptStartedAt) / 1000));
                        emitStatus(`Reasoning in ${cand.modelId} (${reasoningChars} chars · ${sec}s)...`, {
                          modelId: cand.modelId,
                          providerId: cand.providerId,
                        });
                      }
                    },
                    onContent: (delta: string) => {
                      if (!delta || attemptCtrl.signal.aborted) return;
                      receivedAnyChunk = true;
                      streamedContent += delta;
                      streamedChars = streamedContent.length;
                      sendToRenderer('chat:live-progress', {
                        conversationId,
                        type: 'chunk',
                        content: streamedContent,
                        modelId: cand.modelId,
                        providerId: cand.providerId,
                      });
                      const nowMs = Date.now();
                      if (nowMs - lastStatusEmit > 450) {
                        lastStatusEmit = nowMs;
                        const sec = Math.max(1, Math.round((nowMs - attemptStartedAt) / 1000));
                        emitStatus(`Streaming from ${cand.modelId} (${streamedChars} chars · ${sec}s)...`, {
                          modelId: cand.modelId,
                          providerId: cand.providerId,
                        });
                      }
                    },
                    onDone: (u: any) => {
                      if (u) streamedUsage = u;
                      finish();
                    },
                    onError: (err: Error) => {
                      finish(err);
                    },
                  }
                )
                .then(() => finish())
                .catch(finish);
            });
          } catch (streamErr: any) {
            if (!receivedAnyChunk && !attemptTimedOut && !abortController.signal.aborted && !isQuotaOrModelUnavailableError(streamErr)) {
              streamErroredBeforeContent = true;
            } else {
              throw streamErr;
            }
          }

          let finalModelId = cand.modelId;
          if (streamErroredBeforeContent || (!receivedAnyChunk && !streamedContent)) {
            emitStatus(`Requesting completion from ${cand.providerDisplayName} (${cand.modelId})...`, {
              modelId: cand.modelId,
              providerId: cand.providerId,
            });
            const response = await providerManager.complete(targetProviderKey, {
              model: cand.modelId,
              messages: history,
              systemPrompt: universalSkillSystem,
              signal: attemptCtrl.signal,
            });
            assistantContent = response.content || '';
            tokens = response.usage;
            finalModelId = response.model || cand.modelId;
          } else {
            assistantContent = streamedContent;
            tokens = streamedUsage;
          }

          if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
            return { aborted: true, userMessage: null as any, assistantMessage: null as any };
          }

          // Guarantee accurate persisted token usage even when an endpoint omits usage metadata
          if (!tokens || !tokens.totalTokens) {
            const estIn = Math.max(1, Math.ceil((promptText || '').length / 4));
            const estOut = Math.max(1, Math.ceil((assistantContent || '').length / 4));
            tokens = { inputTokens: estIn, outputTokens: estOut, totalTokens: estIn + estOut };
          }

          if (attempt > 0 && (cand.modelId !== initialCandidate.modelId || cand.keyId !== initialCandidate.keyId)) {
            failoverCount = attempt;
            // Suppress transition notices when the previous failure was silent background auth switching
            if (!failedAuthKeys.has(initialCandidate.keyId)) {
              failoverTransitionNote = `> ⚡ **Automatic Model Failover**: Limit reached on **${initialCandidate.modelId}**. Switched cleanly to **${finalModelId}** (${cand.providerDisplayName}).\n\n`;
            }
          }
          updateConversation(conversationId, {
            modelId: finalModelId,
            providerId: cand.providerId,
          });
          usedModelId = finalModelId;
          usedProviderId = cand.providerId;
          break;
        } catch (err: any) {
          if (attemptTimedOut && !abortController.signal.aborted) {
            err = new Error(`Model ${cand.modelId} timed out after ${Math.round(attemptTimeoutMs / 1000)}s`);
          }
          if (err?.name === 'AbortError' && !attemptTimedOut) {
            return { aborted: true, userMessage: null as any, assistantMessage: null as any };
          }
          if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
            return { aborted: true, userMessage: null as any, assistantMessage: null as any };
          }

          const hasNext = candidatesToTry.slice(attempt + 1).some(c => !failedAuthKeys.has(c.keyId) && c.keyId !== cand.keyId) || candidatesToTry.length > attempt + 1;
          const errStr = err instanceof Error ? err.message : String(err);
          if (isAuthError(err)) {
            failedAuthKeys.add(cand.keyId);
            markKeyAuthFailed(cand.keyId, errStr);
          } else if (isQuotaOrModelUnavailableError(err)) {
            markModelExhausted(cand.keyId, cand.modelId, errStr);
          }
          if ((isQuotaOrModelUnavailableError(err) || preferredFailover !== false) && hasNext) {
            console.warn(
              `[Overviewer-Failover] ${cand.modelId} (${cand.providerId}) failed (${errStr}). Silently switching in background...`
            );
            continue;
          }

          console.error('Provider complete error:', err);
          assistantContent = `Error generating response with **${cand.modelId}**: ${err instanceof Error ? err.message : String(err)}`;
          usedModelId = cand.modelId;
          usedProviderId = cand.providerId;
          break;
        } finally {
          clearInterval(heartbeat);
          clearTimeout(attemptTimer);
          abortController.signal.removeEventListener('abort', onParentAbort);
        }
      }

      if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
        return { aborted: true, userMessage: null as any, assistantMessage: null as any };
      }

      if (failoverTransitionNote) {
        assistantContent = failoverTransitionNote + assistantContent;
      }

      const assistantMessage = createMessage({
        conversationId,
        role: 'assistant',
        content: assistantContent,
        modelId: usedModelId,
        providerId: usedProviderId,
        status: 'complete',
        tokens,
      });

      sendToRenderer('chat:live-progress', {
        conversationId,
        type: 'done',
        modelId: usedModelId,
        providerId: usedProviderId,
        taskType: decision.taskType,
        overviewerModelId: decision.overviewerUsed?.modelId,
      });

      return {
        userMessage,
        assistantMessage,
        routing: {
          taskType: decision.taskType,
          selectedModel: usedModelId,
          selectedProvider: usedProviderId,
          overviewerModelId: decision.overviewerUsed?.modelId,
          failoverCount,
        },
      };
    } finally {
      const set = activeChatAbortControllers.get(conversationId);
      if (set) {
        set.delete(abortController);
        if (set.size === 0) activeChatAbortControllers.delete(conversationId);
      }
    }
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_STREAM_MESSAGE, async (_event, { conversationId, content, modelId }) => {
    // Create user message
    createMessage({
      conversationId,
      role: 'user',
      content,
      status: 'complete',
    });

    // Create placeholder assistant message for streaming
    const assistantMessage = createMessage({
      conversationId,
      role: 'assistant',
      content: '',
      modelId,
      providerId: 'placeholder',
      status: 'streaming',
    });

    // Simulate streaming (in real implementation, this would connect to AI provider)
    const abortController = new AbortController();
    activeStreamAbortControllers.set(assistantMessage.id, abortController);

    // Return async iterable for streaming
    return (async function* () {
      const chunks = [
        'This is a simulated streaming response. ',
        'In production, this would connect to the actual AI provider. ',
        'The message would stream token by token. ',
        'End of response.',
      ];

      let fullContent = '';
      for (const chunk of chunks) {
        if (abortController.signal.aborted) break;
        fullContent += chunk;
        yield { type: 'content', content: chunk } as StreamChunk;
        await new Promise(r => setTimeout(r, 50));
      }

      // Update message with complete content
      updateMessage(assistantMessage.id, { content: fullContent, status: 'complete' });
      activeStreamAbortControllers.delete(assistantMessage.id);
      yield { type: 'done' } as StreamChunk;
    })();
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_CANCEL_STREAM, async (_event, targetId) => {
    const controller = activeStreamAbortControllers.get(targetId);
    if (controller) {
      controller.abort();
      activeStreamAbortControllers.delete(targetId);
      updateMessage(targetId, { status: 'complete' });
    }
    const chatControllers = activeChatAbortControllers.get(targetId);
    if (chatControllers) {
      for (const ctrl of chatControllers) {
        try {
          ctrl.abort();
        } catch {}
      }
      activeChatAbortControllers.delete(targetId);
    }
  });

  ipcMain.handle(IPC_CHANNELS.CHAT_REGENERATE_MESSAGE, async (_event, messageId) => {
    const db = getDatabase();
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId) as any;
    if (!message) throw new Error('Message not found');

    const conversationId: string = message.conversation_id;
    // Delete this and all subsequent messages in conversation
    db.prepare('DELETE FROM messages WHERE conversation_id = ? AND created_at >= ?').run(conversationId, message.created_at);

    const history = getMessages(conversationId);
    const lastUser = [...history].reverse().find(m => m.role === 'user');
    const promptText = lastUser
      ? typeof lastUser.content === 'string'
        ? lastUser.content
        : JSON.stringify(lastUser.content)
      : '';

    const allKeys = getApiKeys();
    const resolveKeySecret = async (match: ApiKeyEntry): Promise<string | null> => {
      const k = await getStoredApiKey(match.providerId, match.keyName);
      if (k) return k;
      if (match.encryptedKey && !match.encryptedKey.startsWith('encrypted:')) {
        try {
          return await decrypt(match.encryptedKey);
        } catch {}
      }
      return null;
    };

    const candidates = await collectAllModelCandidates(allKeys, resolveKeySecret);
    const targetCandidate =
      candidates.find(c => c.modelId === message.model_id) ||
      candidates[0];

    if (!targetCandidate) {
      return createMessage({
        conversationId,
        role: 'assistant',
        content: '⚠️ **No API key available**: Please add a valid API key in **Sidebar → API Keys** before regenerating.',
        modelId: message.model_id || 'auto',
        providerId: message.provider_id || 'auto',
        status: 'error',
      });
    }

    const profile = resolveApiKeyProfile(targetCandidate.keySecret, targetCandidate.providerId, targetCandidate.keyName);
    const provider = providerManager.getProviderForKeyProfile(targetCandidate.providerId, targetCandidate.keySecret);
    if (provider) {
      provider.updateConfig({
        apiKey: targetCandidate.keySecret,
        ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
      });
    }
    const targetProviderKey = provider ? provider.getId() : targetCandidate.providerId;
    const response = await providerManager.complete(targetProviderKey, {
      model: targetCandidate.modelId,
      messages: history,
      systemPrompt: buildUniversalSkillsPrompt(promptText),
    });

    return createMessage({
      conversationId,
      role: 'assistant',
      content: response.content || '',
      modelId: targetCandidate.modelId,
      providerId: targetCandidate.providerId,
      tokens: response.usage,
      status: 'complete',
    });
  });

  ipcMain.handle('chat:transcribe-audio', async (_event, input: { wavBase64: string; keyId?: string; preferredEngine?: 'auto' | 'gemini' | 'openai-whisper' | 'windows-speech'; language?: string }) => {
    const cleanBase64 = (input?.wavBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
    if (!cleanBase64) {
      return { text: '', source: 'none', error: 'No audio captured' };
    }

    // Server-side PCM WAV energy, voiced-frame density & duration gate so silent/ambient buffers never trigger Whisper hallucinations
    const wavBuf = Buffer.from(cleanBase64, 'base64');
    const pcmOffset = wavBuf.length > 44 ? 44 : 0;
    const sampleCount = Math.floor((wavBuf.length - pcmOffset) / 2);
    const wavSampleRate = wavBuf.length >= 28 ? wavBuf.readUInt32LE(24) || 48000 : 48000;
    const wavDurationSec = sampleCount / Math.max(8000, wavSampleRate);
    if (sampleCount < 2400 || wavDurationSec < 0.16) {
      return { text: '', source: 'silence-gate' };
    }
    let sumSq = 0;
    let peakAmp = 0;
    const winSamples = Math.max(160, Math.floor(wavSampleRate * 0.02));
    let totalWindows = 0;
    let voicedWindows = 0;
    let winSumSq = 0;
    let winCount = 0;
    for (let i = pcmOffset; i + 1 < wavBuf.length; i += 2) {
      const norm = wavBuf.readInt16LE(i) / 32768;
      const abs = Math.abs(norm);
      if (abs > peakAmp) peakAmp = abs;
      sumSq += norm * norm;
      winSumSq += norm * norm;
      winCount += 1;
      if (winCount >= winSamples) {
        totalWindows += 1;
        if (Math.sqrt(winSumSq / winCount) >= 0.016) {
          voicedWindows += 1;
        }
        winSumSq = 0;
        winCount = 0;
      }
    }
    const wavRms = Math.sqrt(sumSq / sampleCount);
    const voicedSubFrameRatio = totalWindows > 0 ? voicedWindows / totalWindows : 0;
    if ((wavRms < 0.0085 && peakAmp < 0.04) || voicedWindows < 2) {
      return { text: '', source: 'silence-gate' };
    }

    const filterGhostTranscript = (raw: string, source: string, noSpeechProb?: number, avgLogprob?: number) => {
      const cleaned = (raw || '').trim();
      if (!cleaned) return null;
      if (typeof noSpeechProb === 'number' && (noSpeechProb > 0.50 || (noSpeechProb > 0.35 && (avgLogprob ?? 0) < -0.9))) {
        return { text: '', source: `${source}-nospeech-guard` };
      }
      const lowerNorm = cleaned.toLowerCase().replace(/[^\w\s']/g, '').trim();
      const whisperNoiseHallucinations = new Set([
        'thank you',
        'thank you very much',
        'thank you so much',
        'thanks',
        'thanks for watching',
        'thank you for watching',
        'bye',
        'bye bye',
        'goodbye',
        'you',
        'yes',
        'oh',
        'okay',
        'mbc',
        'subtitles by',
        'captioned by',
        'amaraorg',
        'music',
        'silence',
      ]);
      // Block Whisper silence/reverb hallucinations when vocal energy/density is borderline or clip is brief low-peak noise
      if (whisperNoiseHallucinations.has(lowerNorm) || cleaned.length <= 2) {
        if (
          wavRms < 0.065 ||
          voicedSubFrameRatio < 0.32 ||
          (wavDurationSec < 1.4 && peakAmp < 0.14)
        ) {
          return { text: '', source: `${source}-hallucination-guard` };
        }
      }
      return { text: cleaned, source };
    };

    const preferredEngine = input?.preferredEngine || 'auto';
    const lang = (input?.language || 'en').trim().toLowerCase();
    const isEnglish = !lang || lang === 'en' || lang.startsWith('en-');
    const whisperLang = lang === 'auto' ? '' : lang.split('-')[0];
    const allKeys = getApiKeys();
    const resolveKeySecret = async (match: ApiKeyEntry): Promise<string | null> => {
      const k = await getStoredApiKey(match.providerId, match.keyName);
      if (k) return k;
      if (match.encryptedKey && !match.encryptedKey.startsWith('encrypted:')) {
        try {
          return await decrypt(match.encryptedKey);
        } catch {}
      }
      return null;
    };

    const providerKeys: Record<string, string> = {};
    let groqKey = '';
    const selectedKeyEntry = input?.keyId ? allKeys.find(k => k.id === input.keyId) : undefined;
    if (selectedKeyEntry) {
      const secret = await resolveKeySecret(selectedKeyEntry);
      if (secret) {
        const resolved = inferProviderFromApiKey(secret, selectedKeyEntry.providerId, selectedKeyEntry.keyName);
        providerKeys[resolved] = secret;
        if (secret.trim().startsWith('gsk_') || selectedKeyEntry.keyName.toLowerCase().includes('groq')) {
          groqKey = secret;
        }
      }
    }
    for (const kEntry of allKeys) {
      const secret = await resolveKeySecret(kEntry);
      if (secret) {
        const resolved = inferProviderFromApiKey(secret, kEntry.providerId, kEntry.keyName);
        if (!providerKeys[resolved]) providerKeys[resolved] = secret;
        if (!groqKey && (secret.trim().startsWith('gsk_') || kEntry.keyName.toLowerCase().includes('groq'))) {
          groqKey = secret;
        }
      }
    }
    if (!providerKeys.google && process.env.GEMINI_API_KEY) {
      providerKeys.google = process.env.GEMINI_API_KEY;
    }

    const tryGemini = async () => {
      if (!providerKeys.google) return null;
      try {
        const geminiPrompt = isEnglish
          ? 'The speaker is speaking English. Transcribe this spoken English audio accurately into plain English text with punctuation. Do not translate into any other language and do not output non-English words or scripts. Return ONLY the English transcription and nothing else. If silence or unintelligible, return empty string.'
          : `Transcribe this spoken audio (language hint: ${lang}) accurately into plain text with punctuation. Return ONLY the transcribed text and nothing else. If silence or unintelligible, return empty string.`;
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${providerKeys.google}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: geminiPrompt },
                    { inlineData: { mimeType: 'audio/wav', data: cleanBase64 } },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 512,
                thinkingConfig: { thinkingBudget: 0 },
              },
            }),
            signal: AbortSignal.timeout(4500),
          }
        );
        if (resp.ok) {
          const data: any = await resp.json();
          const text = (data?.candidates?.[0]?.content?.parts?.filter((p: any) => !p?.thought).map((p: any) => p.text).join('') || '').trim();
          lastWorkingSttEngine = 'gemini';
          if (text) return { text, source: 'gemini' };
        } else {
          markSttCooldown('gemini');
        }
      } catch {
        markSttCooldown('gemini');
      }
      return null;
    };

    const tryOpenAiWhisper = async () => {
      if (!providerKeys.openai) return null;
      try {
        const audioBuffer = Buffer.from(cleanBase64, 'base64');
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'voice.wav');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'verbose_json');
        formData.append('temperature', '0');
        if (whisperLang) formData.append('language', whisperLang);

        const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${providerKeys.openai}` },
          body: formData as any,
          signal: AbortSignal.timeout(4200),
        });
        if (resp.ok) {
          const data: any = await resp.json();
          const text = (data?.text || '').trim();
          const firstSeg = Array.isArray(data?.segments) ? data.segments[0] : undefined;
          lastWorkingSttEngine = 'openai';
          if (text) {
            return {
              text,
              source: 'openai-whisper',
              noSpeechProb: typeof firstSeg?.no_speech_prob === 'number' ? firstSeg.no_speech_prob : undefined,
              avgLogprob: typeof firstSeg?.avg_logprob === 'number' ? firstSeg.avg_logprob : undefined,
            };
          }
        } else {
          markSttCooldown('openai');
        }
      } catch {
        markSttCooldown('openai');
      }
      return null;
    };

    const tryGroqWhisper = async () => {
      if (!groqKey) return null;
      try {
        const audioBuffer = Buffer.from(cleanBase64, 'base64');
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'voice.wav');
        formData.append('model', 'whisper-large-v3-turbo');
        formData.append('response_format', 'verbose_json');
        formData.append('temperature', '0');
        if (whisperLang) formData.append('language', whisperLang);

        const resp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${groqKey}` },
          body: formData as any,
          signal: AbortSignal.timeout(3500),
        });
        if (resp.ok) {
          const data: any = await resp.json();
          const text = (data?.text || '').trim();
          const firstSeg = Array.isArray(data?.segments) ? data.segments[0] : undefined;
          lastWorkingSttEngine = 'groq';
          if (text) {
            return {
              text,
              source: 'groq-whisper',
              noSpeechProb: typeof firstSeg?.no_speech_prob === 'number' ? firstSeg.no_speech_prob : undefined,
              avgLogprob: typeof firstSeg?.avg_logprob === 'number' ? firstSeg.avg_logprob : undefined,
            };
          }
        } else {
          markSttCooldown('groq');
        }
      } catch {
        markSttCooldown('groq');
      }
      return null;
    };

    if (preferredEngine === 'openai-whisper') {
      const openaiHit = await tryOpenAiWhisper();
      if (openaiHit) {
        return filterGhostTranscript(openaiHit.text, openaiHit.source, openaiHit.noSpeechProb, openaiHit.avgLogprob) || { text: '', source: 'hallucination-guard' };
      }
    } else if (preferredEngine === 'gemini') {
      const gemHit = await tryGemini();
      if (gemHit) return filterGhostTranscript(gemHit.text, gemHit.source) || { text: '', source: 'hallucination-guard' };
    }

    if (preferredEngine !== 'windows-speech') {
      // Prioritize last-known working fast cloud STT first and skip cooled-down engines so latency stays under ~400ms
      const order: Array<'groq' | 'openai' | 'gemini'> = ['groq', 'openai', 'gemini'];
      if (lastWorkingSttEngine && order.includes(lastWorkingSttEngine)) {
        order.splice(order.indexOf(lastWorkingSttEngine), 1);
        order.unshift(lastWorkingSttEngine);
      }
      for (const eng of order) {
        if (isSttInCooldown(eng)) continue;
        const hit =
          eng === 'groq'
            ? await tryGroqWhisper()
            : eng === 'openai'
            ? await tryOpenAiWhisper()
            : await tryGemini();
        if (hit) {
          return (
            filterGhostTranscript(hit.text, hit.source, (hit as any).noSpeechProb, (hit as any).avgLogprob) || {
              text: '',
              source: 'hallucination-guard',
            }
          );
        }
      }
    }

    // Offline Windows System.Speech dictation fallback (requires no API key)
    if (process.platform === 'win32') {
      const execFileAsync = promisify(execFile);
      const tmpWavPath = path.join(os.tmpdir(), `exco-voice-${Date.now()}-${Math.random().toString(36).slice(2)}.wav`);
      try {
        await fs.writeFile(tmpWavPath, Buffer.from(cleanBase64, 'base64'));
        const safePath = tmpWavPath.replace(/'/g, "''");
        const psScript = [
          'Add-Type -AssemblyName System.Speech',
          ...(isEnglish
            ? [
                'try { $rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine([System.Globalization.CultureInfo]::GetCultureInfo("en-US")) } catch { $rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine }',
              ]
            : ['$rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine']),
          '$rec.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))',
          `$rec.SetInputToWaveFile('${safePath}')`,
          '$parts = @()',
          'while ($true) { $res = $rec.Recognize(); if ($null -eq $res) { break }; if ($res.Text) { $parts += $res.Text } }',
          '$rec.Dispose()',
          '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
          'Write-Output ($parts -join " ")',
        ].join('; ');

        const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psScript], {
          timeout: 15000,
        });
        const text = (stdout || '').trim();
        return { text, source: 'windows-speech' };
      } catch (err: any) {
        return {
          text: '',
          source: 'windows-speech',
          error: err?.message || 'Speech recognition failed. Add an API key in Sidebar > API Keys for cloud transcription.',
        };
      } finally {
        await fs.unlink(tmpWavPath).catch(() => {});
      }
    }

    return {
      text: '',
      source: 'none',
      error: 'No transcription engine available. Configure an API key in Sidebar > API Keys.',
    };
  });

  // Isolated Live Voice Chat Turn: routes dynamically via EXCO Model Router & Overviewer across ALL providers,
  // never writes messages to SQLite during the live session, and never emits chat:live-progress into the chat thread.
  ipcMain.handle('chat:voice-turn', async (_event, input: {
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
  }) => {
    const sessionId = input?.sessionId || `voice-${Date.now()}`;
    const userText = (input?.userText || '').trim();
    if (!userText) {
      return { assistantText: '', modelId: 'none', providerId: 'none', error: 'Empty voice input' };
    }

    // Cancel any previous in-flight turn on the same voice session
    const prevCtrl = activeVoiceAbortControllers.get(sessionId);
    if (prevCtrl) {
      try { prevCtrl.abort(); } catch {}
    }
    const abortController = new AbortController();
    activeVoiceAbortControllers.set(sessionId, abortController);

    const emitVoiceStatus = (statusText: string, extra: Record<string, any> = {}) => {
      sendToRenderer('chat:voice-progress', {
        sessionId,
        type: 'status',
        statusText,
        ...extra,
      });
    };

    try {
      const isAutoRequested = !input.modelId || input.modelId === 'auto' || input.modelId === 'default';
      const requestedModel = isAutoRequested ? 'auto' : input.modelId!;
      const requestedKeyId = input.keyId || '';

      const existingSticky = activeVoiceStickyModels.get(sessionId);
      const canReuseSticky = Boolean(
        existingSticky &&
        existingSticky.requestedModel === requestedModel &&
        existingSticky.requestedKeyId === requestedKeyId &&
        Date.now() - existingSticky.updatedAt < 30 * 60 * 1000
      );

      let candidatesToTry: RoutedCandidate[] = [];
      let taskType: any = 'fast-chat';
      let overviewerModelIdUsed: string | undefined;

      if (canReuseSticky && existingSticky) {
        // Reuse the locked working voice model immediately (0ms discovery/routing lag across casual & serious prompts)
        candidatesToTry = [existingSticky.lockedCandidate, ...existingSticky.orderedBackups];
        sendToRenderer('chat:voice-progress', {
          sessionId,
          type: 'routing',
          taskType: 'fast-chat',
          modelId: existingSticky.lockedCandidate.modelId,
          providerId: existingSticky.lockedCandidate.providerId,
          statusText: `Speaking with ${existingSticky.lockedCandidate.modelId}...`,
        });
      } else {
        emitVoiceStatus('Selecting best model for voice turn...');
        const allKeys = getApiKeys();
        const pool = await collectAllModelCandidates(allKeys, resolveKeySecretForRouter, abortController.signal);

        if (abortController.signal.aborted) {
          return { aborted: true, assistantText: '', modelId: 'none', providerId: 'none' };
        }

        if (pool.length === 0) {
          return {
            assistantText: 'Please add an API key in Sidebar API Keys so I can reply in voice chat.',
            modelId: 'No API Key',
            providerId: 'none',
            error: 'No API key configured',
          };
        }

        const conv = input.conversationId ? getConversation(input.conversationId) : null;
        // Force 'turbo' (zero Overviewer keyword switching) in Voice Chat so serious questions keep the same reliable fast model
        const decision = await routeTurnWithOverviewer({
          pool,
          promptText: userText,
          requestedModel,
          preferredKeyId: input.keyId,
          workflowMode: 'turbo',
          reasoningEffort: conv?.reasoningEffort,
          hasHeavyAttachments: false,
          hasAnyAttachment: false,
          preferredFailover: input.preferredFailover !== false,
          signal: abortController.signal,
          onStatus: msg => emitVoiceStatus(msg),
        });

        if (abortController.signal.aborted || !decision) {
          return { aborted: true, assistantText: '', modelId: 'none', providerId: 'none' };
        }

        taskType = decision.taskType;
        overviewerModelIdUsed = decision.overviewerUsed?.modelId;

        sendToRenderer('chat:voice-progress', {
          sessionId,
          type: 'routing',
          taskType: decision.taskType,
          modelId: decision.selected.modelId,
          providerId: decision.selected.providerId,
          overviewerModelId: decision.overviewerUsed?.modelId,
          statusText: `Speaking with ${decision.selected.modelId}...`,
        });

        // Strictly exhaust ALL Tier 1 Leading Models (across connected keys in round-robin)
        // before trying Tier 2 Secondary, and ONLY touch Tier 3 obscure engines if ZERO Tier 1/2 tokens remain.
        for (const tier of [1, 2, 3] as const) {
          const tierList = decision.candidates.filter(c => getModelQualityTier(c.modelId, c.modelName) === tier);
          const bucketsByKey = new Map<string, RoutedCandidate[]>();
          for (const c of tierList) {
            const list = bucketsByKey.get(c.keyId) || [];
            list.push(c);
            bucketsByKey.set(c.keyId, list);
          }
          let addedInPass = true;
          while (addedInPass) {
            addedInPass = false;
            for (const list of bucketsByKey.values()) {
              const nextCand = list.shift();
              if (nextCand) {
                candidatesToTry.push(nextCand);
                addedInPass = true;
              }
            }
          }
        }
      }

      // Build isolated conversation context: prior DB messages (if any) + in-memory voice turns + current utterance
      const priorDbMessages: Message[] = input.conversationId
        ? getMessages(input.conversationId).map(m => ({
            ...m,
            content: typeof m.content === 'string' ? stripVoiceSessionMarkerForContext(m.content) : m.content,
          }))
        : [];

      const voiceHistoryMessages: Message[] = (Array.isArray(input.voiceHistory) ? input.voiceHistory : [])
        .filter(h => h && (h.role === 'user' || h.role === 'assistant') && typeof h.text === 'string' && h.text.trim())
        .map((h, idx) => ({
          id: `voice-hist-${idx}`,
          conversationId: input.conversationId || sessionId,
          role: h.role,
          content:
            h.role === 'assistant'
              ? h.text.replace(/^\s*(?:\*{0,2}(?:AI\s*Assistant|Assistant|EXCO(?:\s+AI)?|Model|Bot)\*{0,2}\s*[:\-–—]\s*)+/i, '').trim()
              : h.text,
          createdAt: Date.now(),
          status: 'complete' as const,
        }));

      const currentUserMsg: Message = {
        id: `voice-cur-${Date.now()}`,
        conversationId: input.conversationId || sessionId,
        role: 'user',
        content: userText,
        createdAt: Date.now(),
        status: 'complete',
      };

      // Merge consecutive same-role text messages so providers (DeepSeek/Anthropic/Gemini) never reject back-to-back user turns
      const rawHistory = [...priorDbMessages, ...voiceHistoryMessages, currentUserMsg];
      const history: Message[] = [];
      for (const m of rawHistory) {
        const last = history[history.length - 1];
        if (last && last.role === m.role && typeof last.content === 'string' && typeof m.content === 'string') {
          last.content = `${last.content}\n${m.content}`;
        } else {
          history.push({ ...m });
        }
      }
      const voiceLang = (input?.language || 'en').trim().toLowerCase();
      const langInstruction =
        !voiceLang || voiceLang === 'en' || voiceLang.startsWith('en-')
          ? 'Always understand the user in English and reply strictly in natural English unless the user explicitly asks you to speak in another language.'
          : voiceLang === 'auto'
          ? 'Reply in the same language the user is speaking.'
          : `Reply in language "${voiceLang}" unless the user asks otherwise.`;
      const voiceSystemPrompt = `[LIVE VOICE CHAT MODE]\nYou are speaking directly in a live bidirectional voice conversation. ${langInstruction} Reply naturally and concisely in 1-3 spoken sentences (unless asked for more detail). Speak directly—NEVER start your reply with "AI Assistant:", "Assistant:", "EXCO:", or any speaker label, and never recite unrelated technical skills.`;

      let assistantText = '';
      let tokens: any = undefined;
      let usedModelId = candidatesToTry[0]?.modelId || 'auto';
      let usedProviderId = candidatesToTry[0]?.providerId || 'auto';
      let failoverCount = 0;
      let lastErrorMsg = '';
      const failedVoiceAuthKeys = new Set<string>();
      const maxAttempts = Math.min(candidatesToTry.length, 14);

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (abortController.signal.aborted) {
          return { aborted: true, assistantText: '', modelId: usedModelId, providerId: usedProviderId };
        }

        const cand = candidatesToTry[attempt];
        if (failedVoiceAuthKeys.has(cand.keyId)) continue;
        const profile = resolveApiKeyProfile(cand.keySecret, cand.providerId, cand.keyName);
        if (attempt > 0) {
          sendToRenderer('chat:voice-progress', {
            sessionId,
            type: 'routing',
            taskType,
            modelId: cand.modelId,
            providerId: cand.providerId,
            statusText: `Routing via ${cand.modelId}...`,
          });
        }

        const provider = providerManager.getProviderForKeyProfile(cand.providerId, cand.keySecret);
        if (provider) {
          provider.updateConfig({
            apiKey: cand.keySecret,
            ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
          });
        }
        const targetProviderKey = provider ? provider.getId() : cand.providerId;
        const isLargerModel = /\b(pro|sonnet|opus|gpt-4o|gpt-4\.1|gpt-5|o3|70b|72b|r1)\b/i.test(cand.modelId);
        const firstByteTimeoutMs = attempt + 1 < maxAttempts ? (isLargerModel ? 11500 : 8500) : 20000;
        const attemptCtrl = new AbortController();
        const onParentAbort = () => attemptCtrl.abort();
        abortController.signal.addEventListener('abort', onParentAbort, { once: true });
        let attemptTimedOut = false;
        let attemptTimer = setTimeout(() => {
          attemptTimedOut = true;
          attemptCtrl.abort();
        }, firstByteTimeoutMs);
        const touchWatchdog = () => {
          clearTimeout(attemptTimer);
          attemptTimer = setTimeout(() => {
            attemptTimedOut = true;
            attemptCtrl.abort();
          }, 12000);
        };

        try {
          let streamedContent = '';
          let streamedUsage: any = undefined;
          let receivedAnyChunk = false;
          let streamErroredBeforeContent = false;

          try {
            await new Promise<void>((resolve, reject) => {
              let settled = false;
              const finish = (err?: any) => {
                if (settled) return;
                settled = true;
                if (err) reject(err);
                else resolve();
              };

              providerManager
                .streamComplete(
                  targetProviderKey,
                  {
                    model: cand.modelId,
                    messages: history,
                    systemPrompt: voiceSystemPrompt,
                    maxTokens: 1024,
                    signal: attemptCtrl.signal,
                  },
                  {
                    onReasoning: () => {
                      if (!attemptCtrl.signal.aborted) touchWatchdog();
                    },
                    onContent: (delta: string) => {
                      if (!delta || attemptCtrl.signal.aborted) return;
                      touchWatchdog();
                      receivedAnyChunk = true;
                      streamedContent += delta;
                      sendToRenderer('chat:voice-progress', {
                        sessionId,
                        type: 'chunk',
                        content: streamedContent,
                        modelId: cand.modelId,
                        providerId: cand.providerId,
                      });
                    },
                    onDone: (u: any) => {
                      if (u) streamedUsage = u;
                      finish();
                    },
                    onError: (err: Error) => {
                      finish(err);
                    },
                  }
                )
                .then(() => finish())
                .catch(finish);
            });
          } catch (streamErr: any) {
            if (!receivedAnyChunk && !attemptTimedOut && !abortController.signal.aborted && !isQuotaOrModelUnavailableError(streamErr)) {
              streamErroredBeforeContent = true;
            } else {
              throw streamErr;
            }
          }

          const stripSpeaker = (s: string) =>
            (s || '').replace(/^\s*(?:\*{0,2}(?:AI\s*Assistant|Assistant|EXCO(?:\s+AI)?|Model|Bot)\*{0,2}\s*[:\-–—]\s*)+/i, '').trim();

          let finalModelId = cand.modelId;
          if (streamErroredBeforeContent || (!receivedAnyChunk && !streamedContent.trim())) {
            const response = await providerManager.complete(targetProviderKey, {
              model: cand.modelId,
              messages: history,
              systemPrompt: voiceSystemPrompt,
              maxTokens: 1024,
              signal: attemptCtrl.signal,
            });
            assistantText = stripSpeaker(response.content || '');
            tokens = response.usage;
            finalModelId = response.model || cand.modelId;
          } else {
            assistantText = stripSpeaker(streamedContent);
            tokens = streamedUsage;
          }

          if (!assistantText || assistantText === '""') {
            throw new Error(`Empty response from ${cand.modelId}`);
          }

          if (!tokens || !tokens.totalTokens) {
            const estIn = Math.max(1, Math.ceil(userText.length / 4));
            const estOut = Math.max(1, Math.ceil(assistantText.length / 4));
            tokens = { inputTokens: estIn, outputTokens: estOut, totalTokens: estIn + estOut };
          }

          if (attempt > 0) failoverCount = attempt;
          usedModelId = finalModelId;
          usedProviderId = cand.providerId;
          // Lock this working model for the rest of the Voice Chat session
          activeVoiceStickyModels.set(sessionId, {
            requestedModel,
            requestedKeyId,
            lockedCandidate: cand,
            orderedBackups: candidatesToTry.filter(c => !(c.keyId === cand.keyId && c.modelId === cand.modelId)),
            updatedAt: Date.now(),
          });
          break;
        } catch (err: any) {
          if (attemptTimedOut && !abortController.signal.aborted) {
            err = new Error(`Model ${cand.modelId} timed out`);
          }
          if (abortController.signal.aborted || (err?.name === 'AbortError' && !attemptTimedOut)) {
            return { aborted: true, assistantText: '', modelId: usedModelId, providerId: usedProviderId };
          }
          const errText = err instanceof Error ? err.message : String(err || 'Unknown error');
          lastErrorMsg = errText;
          console.warn(`[VoiceTurn] ${cand.modelId} (${cand.providerId}) failed: ${errText}`);
          if (isAuthError(err)) {
            failedVoiceAuthKeys.add(cand.keyId);
            markKeyAuthFailed(cand.keyId, errText);
          } else {
            markModelExhausted(cand.keyId, cand.modelId, errText);
          }
          const hasNext = candidatesToTry.slice(attempt + 1).some(c => !failedVoiceAuthKeys.has(c.keyId));
          if ((isQuotaOrModelUnavailableError(err) || input.preferredFailover !== false) && hasNext) {
            continue;
          }
          return {
            assistantText: '',
            modelId: cand.modelId,
            providerId: cand.providerId,
            error: errText,
          };
        } finally {
          clearTimeout(attemptTimer);
          abortController.signal.removeEventListener('abort', onParentAbort);
        }
      }

      if (!assistantText) {
        return {
          assistantText: '',
          modelId: usedModelId,
          providerId: usedProviderId,
          error: lastErrorMsg || 'All routed voice models returned empty responses.',
        };
      }

      sendToRenderer('chat:voice-progress', {
        sessionId,
        type: 'done',
        modelId: usedModelId,
        providerId: usedProviderId,
        taskType,
        overviewerModelId: overviewerModelIdUsed,
      });

      return {
        assistantText: assistantText.trim(),
        modelId: usedModelId,
        providerId: usedProviderId,
        tokens,
        overviewerModelId: overviewerModelIdUsed,
        failoverCount,
      };
    } finally {
      if (activeVoiceAbortControllers.get(sessionId) === abortController) {
        activeVoiceAbortControllers.delete(sessionId);
      }
    }
  });

  ipcMain.handle('chat:cancel-voice', async (_event, sessionId: string) => {
    if (!sessionId) return;
    activeVoiceStickyModels.delete(sessionId);
    const ctrl = activeVoiceAbortControllers.get(sessionId);
    if (ctrl) {
      try { ctrl.abort(); } catch {}
      activeVoiceAbortControllers.delete(sessionId);
    }
  });

  ipcMain.handle('chat:save-voice-session', async (_event, input: {
    conversationId?: string;
    payload: VoiceSessionPayload;
    modelId?: string;
    providerId?: string;
  }) => {
    const payload = input?.payload;
    if (!payload || !Array.isArray(payload.entries)) {
      throw new Error('Invalid voice session payload');
    }

    let targetConvId = input.conversationId;
    let createdConversation: Conversation | null = null;

    if (!targetConvId || !getConversation(targetConvId)) {
      const firstUser = payload.entries.find(e => e.role === 'user')?.text?.trim();
      const title = firstUser ? `Voice: ${firstUser.slice(0, 42)}` : 'Voice Chat';
      createdConversation = createConversation({
        title,
        modelId: input.modelId || 'auto',
        providerId: input.providerId || 'auto',
      });
      targetConvId = createdConversation.id;
    }

    const serialized = serializeVoiceSession(payload);
    const primaryModel = payload.modelsUsed?.[0] || input.modelId || 'voice-chat';
    const message = createMessage({
      conversationId: targetConvId,
      role: 'assistant',
      content: serialized,
      modelId: primaryModel,
      providerId: input.providerId || 'auto',
      status: 'complete',
    });

    return {
      conversationId: targetConvId,
      conversation: createdConversation,
      message,
    };
  });

  ipcMain.handle('chat:list-system-voices', async () => {
    if (process.platform !== 'win32') return [];
    const execFileAsync = promisify(execFile);
    try {
      const psScript = [
        'Add-Type -AssemblyName System.Speech',
        '$s = New-Object System.Speech.Synthesis.SpeechSynthesizer',
        '$voices = $s.GetInstalledVoices() | ForEach-Object { @{ name = $_.VoiceInfo.Name; culture = $_.VoiceInfo.Culture.Name } }',
        '$s.Dispose()',
        '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
        'ConvertTo-Json -InputObject @($voices) -Compress',
      ].join('; ');
      const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psScript], {
        timeout: 8000,
      });
      const parsed = JSON.parse((stdout || '[]').trim() || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  ipcMain.handle('chat:list-api-voices', async () => {
    const allKeys = getApiKeys();
    const dbProviders = getProviders();
    const results: Array<{
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
    }> = [];
    const seenIds = new Set<string>();
    const pushVoice = (item: (typeof results)[number]) => {
      if (seenIds.has(item.id)) return;
      seenIds.add(item.id);
      results.push(item);
    };

    const GEMINI_PREBUILT_VOICES = [
      { voiceId: 'Kore', name: 'Kore (Gemini Natural Female)', description: 'Firm, clear conversational voice (supports Hindi & 70+ languages)' },
      { voiceId: 'Aoede', name: 'Aoede (Gemini Warm Female)', description: 'Breezy, expressive natural female voice' },
      { voiceId: 'Leda', name: 'Leda (Gemini Youthful Female)', description: 'Bright, friendly conversational voice' },
      { voiceId: 'Zephyr', name: 'Zephyr (Gemini Bright)', description: 'Clear, upbeat voice for assistants' },
      { voiceId: 'Puck', name: 'Puck (Gemini Upbeat Male)', description: 'Energetic, warm conversational male voice' },
      { voiceId: 'Charon', name: 'Charon (Gemini Calm Male)', description: 'Informative, steady voice for explanations' },
      { voiceId: 'Fenrir', name: 'Fenrir (Gemini Expressive Male)', description: 'Excitable, dynamic voice' },
      { voiceId: 'Orus', name: 'Orus (Gemini Firm Male)', description: 'Grounded, composed voice' },
    ];

    const OPENAI_TTS_VOICES = [
      { voiceId: 'nova', name: 'Nova (OpenAI Female)', description: 'Warm, natural conversational female voice' },
      { voiceId: 'shimmer', name: 'Shimmer (OpenAI Female)', description: 'Soft, expressive voice' },
      { voiceId: 'coral', name: 'Coral (OpenAI Warm)', description: 'Clear, engaging conversational voice' },
      { voiceId: 'alloy', name: 'Alloy (OpenAI Balanced)', description: 'Neutral, balanced studio voice' },
      { voiceId: 'sage', name: 'Sage (OpenAI Calm)', description: 'Measured, thoughtful voice' },
      { voiceId: 'echo', name: 'Echo (OpenAI Male)', description: 'Smooth, resonant male voice' },
      { voiceId: 'onyx', name: 'Onyx (OpenAI Deep Male)', description: 'Deep, authoritative voice' },
    ];

    const isVoiceTtsModel = (modelId: string, modelName = ''): boolean => {
      const text = `${modelId} ${modelName}`.toLowerCase();
      return /(tts|speech|audio-preview|native-audio|orpheus|playai|kokoro|bark|xtts|chatterbox|voice|sonic)/.test(text) &&
        !/(whisper|transcribe|stt|asr)/.test(text);
    };

    await Promise.all(
      allKeys.map(async entry => {
        const secret = await resolveKeySecretForRouter(entry).catch(() => null);
        if (!secret) return;
        const profile = resolveApiKeyProfile(secret, entry.providerId, entry.keyName);
        const resolvedType = inferProviderFromApiKey(secret, profile.providerId);
        const isElevenLabs =
          secret.trim().startsWith('sk_') ||
          (profile.baseUrl || '').includes('elevenlabs.io') ||
          (entry.keyName || '').toLowerCase().includes('eleven');

        if (isElevenLabs) {
          try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 5000);
            const resp = await fetch('https://api.elevenlabs.io/v1/voices', {
              headers: { 'xi-api-key': secret.trim() },
              signal: ctrl.signal,
            }).finally(() => clearTimeout(timer));
            if (resp.ok) {
              const data: any = await resp.json().catch(() => null);
              const voicesList = Array.isArray(data?.voices) ? data.voices : [];
              for (const v of voicesList) {
                if (!v?.voice_id) continue;
                const labelParts = v.labels && typeof v.labels === 'object'
                  ? Object.values(v.labels).filter(Boolean).slice(0, 3).join(' · ')
                  : '';
                pushVoice({
                  id: `elevenlabs:${entry.id}:${v.voice_id}`,
                  engine: 'elevenlabs',
                  keyId: entry.id,
                  keyName: entry.keyName || 'ElevenLabs',
                  voiceId: String(v.voice_id),
                  name: String(v.name || v.voice_id),
                  category: v.category ? String(v.category) : 'elevenlabs',
                  description: String(v.description || labelParts || 'ElevenLabs Voice'),
                  previewUrl: typeof v.preview_url === 'string' ? v.preview_url : undefined,
                });
              }
            }
          } catch {}
          return;
        }

        // Discover any TTS/Voice models dynamically from the provider's live/cached model catalog
        const matchingProv = dbProviders.find(
          p =>
            (entry.keyName && p.name?.toLowerCase() === entry.keyName.toLowerCase()) ||
            (profile.baseUrl && (p.config?.baseUrl || '').toLowerCase().includes(profile.baseUrl.toLowerCase())) ||
            (resolvedType !== 'custom' && p.type === resolvedType)
        );
        let rawModels: any[] = Array.isArray(matchingProv?.models) ? matchingProv!.models : [];
        if (rawModels.length === 0 && profile.baseUrl) {
          try {
            const cleanBase = profile.baseUrl.replace(/\/+$/, '');
            const modelsUrl =
              resolvedType === 'google'
                ? `${cleanBase}/models`
                : cleanBase.endsWith('/v1')
                ? `${cleanBase}/models`
                : `${cleanBase}/v1/models`;
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 3000);
            const resp = await fetch(modelsUrl, {
              headers:
                resolvedType === 'google'
                  ? { 'x-goog-api-key': secret.trim() }
                  : { Authorization: `Bearer ${secret.trim()}` },
              signal: ctrl.signal,
            }).finally(() => clearTimeout(timer));
            if (resp.ok) {
              const json: any = await resp.json().catch(() => null);
              rawModels = Array.isArray(json?.data) ? json.data : Array.isArray(json?.models) ? json.models : [];
            }
          } catch {}
        }

        const discoveredTtsModels = rawModels.filter(m => {
          const mId = String(m?.id || m?.name || '').replace(/^models\//, '');
          return Boolean(mId) && isVoiceTtsModel(mId, m?.displayName || m?.name || '');
        });

        if (resolvedType === 'google') {
          const geminiTtsModel =
            discoveredTtsModels.find(m => String(m?.id || m?.name || '').toLowerCase().includes('tts'))?.id ||
            'gemini-2.5-flash-preview-tts';
          for (const gv of GEMINI_PREBUILT_VOICES) {
            pushVoice({
              id: `gemini:${entry.id}:${gv.voiceId}`,
              engine: 'gemini',
              keyId: entry.id,
              keyName: entry.keyName || 'Google Gemini',
              voiceId: gv.voiceId,
              modelId: String(geminiTtsModel).replace(/^models\//, ''),
              name: gv.name,
              category: 'gemini',
              description: `${gv.description} · ${entry.keyName || 'Gemini'}`,
            });
          }
        } else if (resolvedType === 'openai') {
          for (const ov of OPENAI_TTS_VOICES) {
            pushVoice({
              id: `openai:${entry.id}:${ov.voiceId}`,
              engine: 'openai',
              keyId: entry.id,
              keyName: entry.keyName || 'OpenAI',
              voiceId: ov.voiceId,
              modelId: 'gpt-4o-mini-tts',
              name: ov.name,
              category: 'openai',
              description: `${ov.description} · ${entry.keyName || 'OpenAI'}`,
            });
          }
        }

        // Expose every custom/gateway TTS voice model returned by this API key (e.g. Groq PlayAI/Orpheus, Together, OpenAI-compat)
        for (const m of discoveredTtsModels) {
          const mId = String(m?.id || m?.name || '').replace(/^models\//, '');
          if (!mId) continue;
          if (resolvedType === 'google' && mId.includes('gemini-2.5-flash-preview-tts')) continue;
          if (resolvedType === 'openai' && /^(tts-1|tts-1-hd|gpt-4o-mini-tts)$/i.test(mId)) continue;
          const display = String(m?.displayName || m?.name || mId);
          const cleanBase = (profile.baseUrl || matchingProv?.config?.baseUrl || '').replace(/\/+$/, '');
          if (!cleanBase) continue;
          const defaultVoice = mId.toLowerCase().includes('orpheus')
            ? 'tara'
            : mId.toLowerCase().includes('playai')
            ? 'Fritz-PlayAI'
            : 'alloy';
          pushVoice({
            id: `custom:${entry.id}:${mId}`,
            engine: 'custom',
            keyId: entry.id,
            keyName: entry.keyName || profile.displayName,
            voiceId: defaultVoice,
            modelId: mId,
            baseUrl: cleanBase,
            name: `${display}`,
            category: profile.displayName,
            description: `${entry.keyName || profile.displayName} · Model: ${mId}`,
          });
        }
      })
    );

    return results;
  });

  ipcMain.handle('chat:warm-tts', async (_event, voiceName?: string) => {
    // Also pre-warm the model router pool in background so Turn 1 selection hits 0ms cache
    collectAllModelCandidates(getApiKeys(), resolveKeySecretForRouter).catch(() => {});
    return warmEdgeTtsClient(voiceName);
  });

  const wrapPcm24kToWavBase64 = (pcmBuf: Buffer): string => {
    const sampleRate = 24000;
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + pcmBuf.length, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34);
    header.write('data', 36);
    header.writeUInt32LE(pcmBuf.length, 40);
    return Buffer.concat([header, pcmBuf]).toString('base64');
  };

  ipcMain.handle('chat:synthesize-speech', async (_event, input: {
    text: string;
    engine?: 'edge-neural' | 'elevenlabs' | 'gemini' | 'openai' | 'custom' | 'system';
    voice?: string;
    modelId?: string;
    baseUrl?: string;
    speed?: number;
    pitch?: number;
    keyId?: string;
  }) => {
    const text = (input?.text || '').trim();
    if (!text) return { error: 'Empty text' };

    const requestedEngine = input?.engine || 'edge-neural';
    const requestedVoice = (input?.voice || 'en-US-AvaNeural').trim();
    const cacheKey = text.length <= 280 ? `${requestedEngine}::${input?.keyId || ''}::${requestedVoice}::${text}` : '';
    if (cacheKey) {
      const cached = getCachedTtsAudio(cacheKey);
      if (cached) {
        return cached;
      }
    }

    let apiFallbackWarning = '';

    // 0A. ElevenLabs API Synthesis
    if (requestedEngine === 'elevenlabs' && requestedVoice) {
      const allKeys = getApiKeys();
      const targetKeyEntry =
        (input?.keyId ? allKeys.find(k => k.id === input.keyId) : undefined) ||
        allKeys.find(k => (k.keyName || '').toLowerCase().includes('eleven'));
      const secret = targetKeyEntry ? await resolveKeySecretForRouter(targetKeyEntry).catch(() => null) : null;
      if (secret) {
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 9000);
          const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(requestedVoice)}`, {
            method: 'POST',
            headers: {
              'xi-api-key': secret.trim(),
              'Content-Type': 'application/json',
              Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
              text: text.slice(0, 2500),
              model_id: 'eleven_flash_v2_5',
            }),
            signal: ctrl.signal,
          }).finally(() => clearTimeout(timer));
          if (resp.ok) {
            const arrBuf = await resp.arrayBuffer();
            const b64 = Buffer.from(arrBuf).toString('base64');
            if (b64) {
              const out = { audioBase64: b64, mimeType: 'audio/mpeg', source: 'elevenlabs' };
              if (cacheKey) setCachedTtsAudio(cacheKey, out);
              return out;
            }
          } else {
            const errTxt = await resp.text().catch(() => '');
            apiFallbackWarning = `ElevenLabs (${resp.status}) unavailable — using Edge Neural fallback.`;
            console.warn('[TTS] ElevenLabs error:', resp.status, errTxt.slice(0, 200));
          }
        } catch (err: any) {
          apiFallbackWarning = `ElevenLabs timeout/error — using Edge Neural fallback.`;
          console.warn('[TTS] ElevenLabs fetch failed:', err?.message || err);
        }
      } else {
        apiFallbackWarning = 'ElevenLabs API key missing — using Edge Neural fallback.';
      }
    }

    // 0B. Google Gemini Native TTS Synthesis
    if (requestedEngine === 'gemini' && requestedVoice) {
      const allKeys = getApiKeys();
      const targetKeyEntry =
        (input?.keyId ? allKeys.find(k => k.id === input.keyId) : undefined) ||
        allKeys.find(k => k.providerId === 'google');
      const secret = targetKeyEntry ? await resolveKeySecretForRouter(targetKeyEntry).catch(() => null) : null;
      if (secret) {
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 12000);
          const resp = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',
            {
              method: 'POST',
              headers: {
                'x-goog-api-key': secret.trim(),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: text.slice(0, 2500) }] }],
                generationConfig: {
                  responseModalities: ['AUDIO'],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: requestedVoice },
                    },
                  },
                },
              }),
              signal: ctrl.signal,
            }
          ).finally(() => clearTimeout(timer));
          if (resp.ok) {
            const json: any = await resp.json().catch(() => null);
            const inline = json?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData?.data)?.inlineData;
            if (inline?.data) {
              const rawMime = String(inline.mimeType || '').toLowerCase();
              const rawBuf = Buffer.from(inline.data, 'base64');
              const isWav = rawMime.includes('wav') || rawMime.includes('mpeg') || rawMime.includes('mp3');
              const out = isWav
                ? { audioBase64: inline.data, mimeType: inline.mimeType || 'audio/wav', source: 'gemini' }
                : { audioBase64: wrapPcm24kToWavBase64(rawBuf), mimeType: 'audio/wav', source: 'gemini' };
              if (cacheKey) setCachedTtsAudio(cacheKey, out);
              return out;
            }
          } else {
            apiFallbackWarning = `Gemini TTS (${resp.status}) unavailable — using Edge Neural fallback.`;
          }
        } catch {
          apiFallbackWarning = 'Gemini TTS error — using Edge Neural fallback.';
        }
      }
    }

    // 0C. OpenAI TTS Synthesis
    if (requestedEngine === 'openai' && requestedVoice) {
      const allKeys = getApiKeys();
      const targetKeyEntry =
        (input?.keyId ? allKeys.find(k => k.id === input.keyId) : undefined) ||
        allKeys.find(k => k.providerId === 'openai');
      const secret = targetKeyEntry ? await resolveKeySecretForRouter(targetKeyEntry).catch(() => null) : null;
      if (secret) {
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 9000);
          const resp = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${secret.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini-tts',
              voice: requestedVoice,
              input: text.slice(0, 2500),
              response_format: 'mp3',
            }),
            signal: ctrl.signal,
          }).finally(() => clearTimeout(timer));
          if (resp.ok) {
            const arrBuf = await resp.arrayBuffer();
            const b64 = Buffer.from(arrBuf).toString('base64');
            if (b64) {
              const out = { audioBase64: b64, mimeType: 'audio/mpeg', source: 'openai' };
              if (cacheKey) setCachedTtsAudio(cacheKey, out);
              return out;
            }
          } else {
            apiFallbackWarning = `OpenAI TTS (${resp.status}) unavailable — using Edge Neural fallback.`;
          }
        } catch {
          apiFallbackWarning = 'OpenAI TTS error — using Edge Neural fallback.';
        }
      }
    }

    // 0D. Custom / OpenAI-Compatible TTS Model (e.g. Groq PlayAI/Orpheus, Together, Local/Gateway TTS)
    if (requestedEngine === 'custom' && input?.modelId && input?.baseUrl) {
      const allKeys = getApiKeys();
      const targetKeyEntry = input?.keyId ? allKeys.find(k => k.id === input.keyId) : undefined;
      const secret = targetKeyEntry ? await resolveKeySecretForRouter(targetKeyEntry).catch(() => null) : null;
      if (secret) {
        try {
          const cleanBase = input.baseUrl.trim().replace(/\/+$/, '');
          const speechUrl = cleanBase.endsWith('/v1') ? `${cleanBase}/audio/speech` : `${cleanBase}/v1/audio/speech`;
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 9000);
          const resp = await fetch(speechUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${secret.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: input.modelId,
              voice: requestedVoice || 'alloy',
              input: text.slice(0, 2500),
              response_format: 'wav',
            }),
            signal: ctrl.signal,
          }).finally(() => clearTimeout(timer));
          if (resp.ok) {
            const arrBuf = await resp.arrayBuffer();
            const b64 = Buffer.from(arrBuf).toString('base64');
            const mime = resp.headers.get('content-type') || 'audio/wav';
            if (b64) {
              const out = { audioBase64: b64, mimeType: mime, source: 'custom' };
              if (cacheKey) setCachedTtsAudio(cacheKey, out);
              return out;
            }
          } else {
            apiFallbackWarning = `API TTS (${resp.status}) unavailable — using Edge Neural fallback.`;
          }
        } catch {
          apiFallbackWarning = 'API TTS error — using Edge Neural fallback.';
        }
      }
    }

    // 1. Primary / Fallback Microsoft Edge Neural Voice (msedge-tts)
    if (requestedEngine !== 'system') {
      const fallbackEdgeVoice = requestedVoice.includes('Neural') ? requestedVoice : 'en-US-AvaNeural';
      const edgeResult = await runEdgeTtsSynthesis(text, fallbackEdgeVoice);
      if (edgeResult) {
        if (cacheKey && !apiFallbackWarning) setCachedTtsAudio(cacheKey, edgeResult);
        return apiFallbackWarning ? { ...edgeResult, warning: apiFallbackWarning } : edgeResult;
      }
    }

    // 2. Last-resort offline Windows System.Speech WAV synthesis
    if (process.platform === 'win32') {
      const execFileAsync = promisify(execFile);
      const psScript = [
        'Add-Type -AssemblyName System.Speech',
        '$s = New-Object System.Speech.Synthesis.SpeechSynthesizer',
        'try { if ($env:EXCO_TTS_VOICE) { $s.SelectVoice($env:EXCO_TTS_VOICE) } } catch {}',
        '$s.Rate = 2',
        '$ms = New-Object System.IO.MemoryStream',
        '$s.SetOutputToWaveStream($ms)',
        '$s.Speak($env:EXCO_TTS_TEXT)',
        '$b64 = [Convert]::ToBase64String($ms.ToArray())',
        '$s.Dispose()',
        '$ms.Dispose()',
        'Write-Output $b64',
      ].join('; ');
      try {
        const { stdout } = await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', psScript],
          {
            timeout: 20000,
            maxBuffer: 25 * 1024 * 1024,
            env: {
              ...process.env,
              EXCO_TTS_TEXT: text.slice(0, 4000),
              EXCO_TTS_VOICE: (input?.voice || '').trim(),
            },
          }
        );
        const audioBase64 = (stdout || '').trim();
        if (audioBase64) {
          return {
            audioBase64,
            mimeType: 'audio/wav',
            source: 'windows-sapi',
          };
        }
      } catch (err: any) {
        return { error: err?.message || 'Speech synthesis failed' };
      }
    }

    return { error: 'Use browser speech synthesis fallback' };
  });
}

// ============================================================================
// Provider Handlers
// ============================================================================

const providerModelProbeAt = new Map<string, number>();

async function extractAndPersistProviderModels(provider: AIProvider): Promise<AIProvider> {
  if (!provider) return provider;
  try {
    const keys = getApiKeys();
    const resolveKeySecret = async (entry: ApiKeyEntry): Promise<string | null> => {
      const k = await getStoredApiKey(entry.providerId, entry.keyName);
      if (k) return k;
      if (entry.encryptedKey && !entry.encryptedKey.startsWith('encrypted:')) {
        try {
          return await decrypt(entry.encryptedKey);
        } catch {}
      }
      return null;
    };

    let secret = provider.config?.apiKey || '';
    if (!secret) {
      const matchingKey = keys.find(
        k => k.keyName.trim().toLowerCase() === provider.name.trim().toLowerCase() || k.providerId === provider.type
      );
      if (matchingKey) {
        secret = (await resolveKeySecret(matchingKey)) || '';
      }
    }

    const hintProfile = resolveApiKeyProfile(secret, provider.type, provider.name);
    const resolvedBaseUrl = provider.config?.baseUrl?.trim() || hintProfile.baseUrl || '';

    providerManager.registerConfiguredProvider(provider);
    const instance =
      providerManager.getProvider(provider.id) ||
      providerManager.getProviderForKeyProfile(provider.type, secret || undefined);
    if (!instance) return provider;

    instance.updateConfig({
      ...(secret ? { apiKey: secret } : {}),
      ...(resolvedBaseUrl ? { baseUrl: resolvedBaseUrl } : {}),
    });

    const fetched = await Promise.race<any[]>([
      instance.listModels(),
      new Promise<any[]>(resolve => setTimeout(() => resolve([]), 4500)),
    ]);

    const modelsToSave = Array.isArray(fetched) && fetched.length > 0 ? fetched : provider.models || [];
    const baseImproved = !provider.config?.baseUrl && resolvedBaseUrl;
    if ((Array.isArray(fetched) && fetched.length > 0) || baseImproved) {
      const updated = updateProvider(provider.id, {
        models: modelsToSave,
        ...(baseImproved ? { config: { ...provider.config, baseUrl: resolvedBaseUrl } } : {}),
      });
      if (updated) {
        providerManager.registerConfiguredProvider(updated);
        return updated;
      }
    }
  } catch {}
  return provider;
}

let lastProvidersSyncAt = 0;
let lastKeysSyncAt = 0;

export function registerProviderHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PROVIDERS_LIST, async () => {
    const now = Date.now();
    if (now - lastProvidersSyncAt > 30_000) {
      lastProvidersSyncAt = now;
      // Run key-to-provider sync & empty-model extraction asynchronously so UI never stalls
      void (async () => {
        const allKeys = getApiKeys();
        for (const kEntry of allKeys) {
          try {
            let secret = await getStoredApiKey(kEntry.providerId, kEntry.keyName);
            if (!secret && kEntry.encryptedKey && !kEntry.encryptedKey.startsWith('encrypted:')) {
              secret = await decrypt(kEntry.encryptedKey).catch(() => null);
            }
            if (secret) {
              await ensureProviderForKey(secret, kEntry.providerId, kEntry.keyName, false);
            }
          } catch {}
        }

        const emptyEnabled = getProviders().filter(
          p => p.enabled && (!Array.isArray(p.models) || p.models.length === 0) &&
            (!providerModelProbeAt.has(p.id) || Date.now() - (providerModelProbeAt.get(p.id) || 0) > 45000)
        );
        if (emptyEnabled.length > 0) {
          await Promise.all(
            emptyEnabled.map(p => {
              providerModelProbeAt.set(p.id, Date.now());
              return extractAndPersistProviderModels(p);
            })
          );
        }
      })();
    }

    return getProviders().map(sanitizeProviderForIpc);
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_CREATE, async (_event, input) => {
    invalidateCandidatePoolCache();
    const validated = validateInput(createProviderInputSchema, input);
    const created = createProvider(validated as any);
    providerManager.registerConfiguredProvider(created);
    const populated = await extractAndPersistProviderModels(created);
    return sanitizeProviderForIpc(populated);
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_UPDATE, async (_event, { id, updates }) => {
    invalidateCandidatePoolCache();
    const validated = validateInput(updateProviderInputSchema, { id, updates });
    const updated = updateProvider(validated.id, validated.updates as any);
    if (updated) {
      providerManager.registerConfiguredProvider(updated);
      const needsExtract = updated.enabled && (!Array.isArray(updated.models) || updated.models.length === 0 || Boolean(updates?.config));
      const finalProvider = needsExtract ? await extractAndPersistProviderModels(updated) : updated;
      return sanitizeProviderForIpc(finalProvider);
    }
    return updated;
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_DELETE, async (_event, id) => {
    invalidateCandidatePoolCache();
    providerManager.unregisterProvider(id);
    return deleteProvider(id);
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_TEST, async (_event, providerId) => {
    const provider = getProvider(providerId);
    if (!provider) return { success: false, error: 'Provider not found' };

    try {
      const refreshed = await extractAndPersistProviderModels(provider);
      providerManager.registerConfiguredProvider(refreshed);
      const instance = providerManager.getProvider(refreshed.id);
      if (!instance) return { success: false, error: 'Provider could not be initialized' };

      // Attach a matching saved API key if one exists for this provider type
      const keys = getApiKeys();
      const matchingKey = keys.find(k => k.keyName === refreshed.name || k.providerId === refreshed.type);
      if (matchingKey && !refreshed.config?.apiKey) {
        let secret = await getStoredApiKey(matchingKey.providerId, matchingKey.keyName);
        if (!secret && matchingKey.encryptedKey && !matchingKey.encryptedKey.startsWith('encrypted:')) {
          secret = await decrypt(matchingKey.encryptedKey).catch(() => null);
        }
        if (secret) instance.updateConfig({ apiKey: secret });
      }

      return await instance.validateConnection();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Test failed' };
    }
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_LIST_MODELS, async (_event, input) => {
    const keyId = typeof input === 'object' && input !== null ? input.keyId : undefined;
    const rawProviderId = typeof input === 'string' ? input : input?.providerId;
    const fetchAllKeys =
      (typeof input === 'object' && input !== null && input.allKeys === true) ||
      (!keyId && !rawProviderId);

    const allKeys = getApiKeys();
    const resolveSecret = async (entry: ApiKeyEntry): Promise<string | null> => {
      const k = await getStoredApiKey(entry.providerId, entry.keyName);
      if (k) return k;
      if (entry.encryptedKey && !entry.encryptedKey.startsWith('encrypted:')) {
        try {
          return await decrypt(entry.encryptedKey);
        } catch {}
      }
      return null;
    };

    const localUsage = getTokenUsageByModel();

    const loadModelsForKey = async (entry: ApiKeyEntry): Promise<any[]> => {
      const secret = await resolveSecret(entry);
      if (!secret) return [];

      const { profile, dbProvider } = await ensureProviderForKey(secret, entry.providerId, entry.keyName, false);
      const resolvedType = profile.providerId;
      const instance =
        (dbProvider ? providerManager.getProvider(dbProvider.id) : undefined) ||
        providerManager.getProviderForKeyProfile(resolvedType, secret);

      if (!instance) return [];

      const updatePayload: { apiKey: string; baseUrl?: string } = { apiKey: secret };
      if (profile.baseUrl) {
        updatePayload.baseUrl = profile.baseUrl;
      }
      instance.updateConfig(updatePayload);

      let models: any[] = [];
      try {
        models = await Promise.race<any[]>([
          instance.listModels(),
          new Promise<any[]>(resolve => setTimeout(() => resolve([]), 5000)),
        ]);
      } catch {
        models = [];
      }
      if (models.length === 0 && dbProvider?.models?.length) {
        models = dbProvider.models;
      } else if (models.length > 0 && dbProvider) {
        updateProvider(dbProvider.id, { models });
      }

      let gatewayTokensUsed = 0;
      let gatewayTokenCap: number | null = null;
      let gatewayUsageData: any = null;
      const platformUsage: Record<string, { used: number; cap: number | null }> = {};

      const baseUrl = profile.baseUrl || instance.getProvider().config?.baseUrl || '';
      const isGatewayCandidate =
        resolvedType === 'custom' ||
        resolvedType === 'openrouter' ||
        baseUrl.includes('127.0.0.1:31415') ||
        baseUrl.includes('localhost:31415') ||
        secret.trim().startsWith('freellma');

      if (isGatewayCandidate && baseUrl) {
        const clean = baseUrl.trim().replace(/\/+$/, '');
        const usageUrl = clean.endsWith('/v1') ? `${clean}/usage` : `${clean}/v1/usage`;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 2500);
        try {
          const uResp = await fetch(usageUrl, { headers: { Authorization: `Bearer ${secret}` }, signal: ctrl.signal });
          if (uResp.ok) {
            const uData: any = await uResp.json();
            gatewayUsageData = uData;
            gatewayTokensUsed = Number(uData?.tokens ?? uData?.tokensUsed ?? uData?.used) || 0;
            const topCap = Number(uData?.tokenCap ?? uData?.limit ?? uData?.quota ?? uData?.maxTokens);
            if (Array.isArray(uData?.byKey) && uData.byKey.length > 0) {
              let sumCap = 0;
              let finiteCount = 0;
              for (const kRow of uData.byKey) {
                const rawCap = kRow.tokenCap ?? kRow.limit ?? kRow.quota ?? kRow.maxTokens;
                if (rawCap !== null && rawCap !== undefined && Number(rawCap) > 0) {
                  sumCap += Number(rawCap);
                  finiteCount += 1;
                }
              }
              gatewayTokenCap = finiteCount > 0 ? sumCap : (Number.isFinite(topCap) && topCap > 0 ? topCap : null);
            } else if (Number.isFinite(topCap) && topCap > 0) {
              gatewayTokenCap = topCap;
            }
            if (Array.isArray(uData?.byPlatform)) {
              for (const pRow of uData.byPlatform) {
                const key = String(pRow.platform || pRow.provider || '').toLowerCase();
                if (key) {
                  const pCapRaw = pRow.tokenCap ?? pRow.limit ?? pRow.quota ?? pRow.maxTokens;
                  platformUsage[key] = {
                    used: Number(pRow.tokens ?? pRow.tokensUsed ?? pRow.used) || 0,
                    cap: pCapRaw !== null && pCapRaw !== undefined ? Number(pCapRaw) : null,
                  };
                }
              }
            }
          }
        } catch {} finally {
          clearTimeout(timer);
        }
      }

      const allowedSet = Array.isArray(gatewayUsageData?.allowedModels)
        ? new Set(gatewayUsageData.allowedModels.map((x: any) => String(x).toLowerCase()))
        : null;

      return models
        .map(m => {
          const resolvedTier = m.tier || inferModelTier(m, profile, secret);
          if (allowedSet && m.id !== 'auto' && !allowedSet.has(String(m.id).toLowerCase())) {
            return null;
          }
          const prefix = m.id.includes('/') ? m.id.split('/')[0].toLowerCase() : '';
          const pUsage = prefix ? platformUsage[prefix] : undefined;
          const used = localUsage[m.id] ?? pUsage?.used ?? 0;
          const fallbackModelCap = m.contextWindow && m.contextWindow > 0 ? m.contextWindow : 128000;
          const hasPlatformCap = pUsage?.cap !== null && pUsage?.cap !== undefined && pUsage.cap > 0;
          const hasAccountCap = gatewayTokenCap !== null && gatewayTokenCap !== undefined && gatewayTokenCap > 0;
          const tokenCapScope: 'platform' | 'account' | 'model' = hasPlatformCap
            ? 'platform'
            : hasAccountCap
            ? 'account'
            : 'model';
          const cap = hasPlatformCap
            ? pUsage!.cap!
            : hasAccountCap
            ? gatewayTokenCap!
            : fallbackModelCap;
          const bench = computeModelBenchmarks({
            ...m,
            providerId: resolvedType,
          });
          return {
            ...m,
            keyId: entry.id,
            keyName: entry.keyName,
            providerId: resolvedType,
            providerDisplayName: entry.keyName || profile.displayName,
            tokensUsed: m.id === 'auto' ? (gatewayTokensUsed || Object.values(localUsage).reduce((a, b) => a + b, 0)) : used,
            tokenCap: m.id === 'auto' ? (gatewayTokenCap ?? fallbackModelCap) : cap,
            tokenCapScope,
            accountTokensUsed: gatewayTokensUsed,
            accountTokenCap: gatewayTokenCap,
            platformKey: hasPlatformCap ? prefix : undefined,
            tier: resolvedTier,
            category: bench.category,
            overallScore: bench.overallScore,
            categoryScores: {
              turbo: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'turbo'),
              standard: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'standard'),
              'deep-thought': scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'deep-thought'),
            },
          };
        })
        .filter(Boolean);
    };

    if (fetchAllKeys && allKeys.length > 0) {
      const batches = await Promise.all(allKeys.map(k => loadModelsForKey(k).catch(() => [])));
      const seen = new Set<string>();
      const combined: any[] = [];
      for (const batch of batches) {
        for (const m of batch) {
          const dedupeKey = `${m.keyId}:${m.id}`;
          if (!seen.has(dedupeKey)) {
            seen.add(dedupeKey);
            combined.push(m);
          }
        }
      }
      return combined;
    }

    const selectedKey = keyId ? allKeys.find(k => k.id === keyId) : undefined;
    if (selectedKey) {
      return await loadModelsForKey(selectedKey);
    }

    const dbProvider = rawProviderId ? getProvider(rawProviderId) : null;
    const resolvedType = dbProvider ? dbProvider.type : rawProviderId || 'custom';
    const matchingKey = allKeys.find(k => k.providerId === resolvedType || (dbProvider && k.keyName === dbProvider.name));
    if (matchingKey) {
      return await loadModelsForKey(matchingKey);
    }

    const instance =
      (dbProvider ? providerManager.getProvider(dbProvider.id) : undefined) ||
      providerManager.getConfiguredProviderByType(resolvedType) ||
      providerManager.getProvider(resolvedType);

    if (!instance) return dbProvider?.models || [];
    try {
      const models = await instance.listModels();
      if (dbProvider && Array.isArray(models) && models.length > 0 && (!dbProvider.models || dbProvider.models.length === 0)) {
        updateProvider(dbProvider.id, { models });
      }
      return models.map(m => {
        const cap = m.contextWindow && m.contextWindow > 0 ? m.contextWindow : 128000;
        const bench = computeModelBenchmarks({ ...m, providerId: resolvedType });
        return {
          ...m,
          tokensUsed: localUsage[m.id] ?? 0,
          tokenCap: cap,
          tier: m.tier || (resolvedType === 'ollama' || m.id.includes(':free') ? 'free' : 'paid'),
          category: bench.category,
          overallScore: bench.overallScore,
          categoryScores: {
            turbo: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'turbo'),
            standard: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'standard'),
            'deep-thought': scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'deep-thought'),
          },
        };
      });
    } catch {
      return dbProvider?.models || [];
    }
  });

  ipcMain.handle('providers:get-usage', async (_event, input) => {
    const keyId = typeof input === 'object' && input !== null ? input.keyId : undefined;
    const allKeys = getApiKeys();
    const localUsage = getTokenUsageByModel();
    const localTotal = Object.values(localUsage).reduce((a, b) => a + b, 0);

    const resolveSecret = async (entry: ApiKeyEntry): Promise<string | null> => {
      const k = await getStoredApiKey(entry.providerId, entry.keyName);
      if (k) return k;
      if (entry.encryptedKey && !entry.encryptedKey.startsWith('encrypted:')) {
        try {
          return await decrypt(entry.encryptedKey);
        } catch {}
      }
      return null;
    };

    const selectedKey = keyId ? allKeys.find(k => k.id === keyId) : allKeys[0];
    if (selectedKey) {
      const secret = await resolveSecret(selectedKey);
      const keyProfile = secret ? resolveApiKeyProfile(secret, selectedKey.providerId) : null;
      const resolvedType = keyProfile ? keyProfile.providerId : selectedKey.providerId;
      const configured = providerManager.getProviderForKeyProfile(resolvedType, secret || undefined);
      const baseUrl = keyProfile?.baseUrl || configured?.getProvider().config?.baseUrl || '';

      if (secret && baseUrl) {
        const clean = baseUrl.trim().replace(/\/+$/, '');
        const usageUrl = clean.endsWith('/v1') ? `${clean}/usage` : `${clean}/v1/usage`;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 2500);
        try {
          const resp = await fetch(usageUrl, { headers: { Authorization: `Bearer ${secret}` }, signal: ctrl.signal });
          if (resp.ok) {
            const data: any = await resp.json();
            const topCap = Number(data?.tokenCap ?? data?.limit ?? data?.quota ?? data?.maxTokens);
            let totalCap: number | null = Number.isFinite(topCap) && topCap > 0 ? topCap : null;
            if (Array.isArray(data?.byKey) && data.byKey.length > 0) {
              const finiteSum = data.byKey.reduce(
                (s: number, k: any) => s + (Number(k.tokenCap ?? k.limit ?? k.quota ?? k.maxTokens) || 0),
                0
              );
              if (finiteSum > 0) totalCap = finiteSum;
            }
            if (!totalCap && Array.isArray(data?.byPlatform) && data.byPlatform.length > 0) {
              const pSum = data.byPlatform.reduce(
                (s: number, p: any) => s + (Number(p.tokenCap ?? p.limit ?? p.quota ?? p.maxTokens) || 0),
                0
              );
              if (pSum > 0) totalCap = pSum;
            }
            return {
              tokensUsed: Number(data?.tokens ?? data?.tokensUsed ?? data?.used) || localTotal,
              tokenCap: totalCap,
              requests: Number(data?.requests) || 0,
              resetsAt: data?.resetsAt || null,
              source: 'gateway',
            };
          }
        } catch {} finally {
          clearTimeout(timer);
        }
      }
    }

    // Aggregate numeric capacity across active providers/models cleanly
    let resolvedCap = 0;
    let requestCount = 0;
    try {
      const db = getDatabase();
      const cntRow = db.prepare(`SELECT COUNT(*) as cnt FROM messages WHERE role = 'assistant'`).get() as any;
      requestCount = Number(cntRow?.cnt) || 0;
    } catch {}

    try {
      const dbProvs = getProviders();
      const targetProvs = selectedKey
        ? dbProvs.filter(p => p.enabled && (p.name === selectedKey.keyName || p.type === selectedKey.providerId))
        : dbProvs.filter(p => p.enabled);
      for (const p of targetProvs.length > 0 ? targetProvs : dbProvs.filter(p => p.enabled)) {
        const pModels = Array.isArray(p.models) ? p.models : [];
        if (pModels.length > 0) {
          resolvedCap += pModels.reduce((sum: number, m: any) => sum + (Number(m?.contextWindow) || 128000), 0);
        }
      }
    } catch {}

    if (resolvedCap <= 0 && allKeys.length > 0) {
      resolvedCap = allKeys.length * 128000;
    }

    return {
      tokensUsed: localTotal,
      tokenCap: resolvedCap > 0 ? resolvedCap : 128000,
      requests: requestCount,
      resetsAt: null,
      source: 'local',
    };
  });

  ipcMain.handle('models:fetch-daily-benchmarks', async () => {
    const d = new Date();
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const telemetryById: Record<string, { contextLength?: number; promptCost?: number; completionCost?: number }> = {};

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch('https://openrouter.ai/api/v1/models', { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const json: any = await resp.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        for (const item of items) {
          if (!item?.id) continue;
          const promptCost = item?.pricing?.prompt !== undefined ? Number(item.pricing.prompt) : undefined;
          const completionCost = item?.pricing?.completion !== undefined ? Number(item.pricing.completion) : undefined;
          telemetryById[String(item.id)] = {
            contextLength: typeof item.context_length === 'number' ? item.context_length : undefined,
            promptCost: Number.isFinite(promptCost) ? promptCost : undefined,
            completionCost: Number.isFinite(completionCost) ? completionCost : undefined,
          };
        }
        return {
          date: dateKey,
          fetchedAt: Date.now(),
          source: `Online Benchmark Catalog (${Object.keys(telemetryById).length} live profiles)`,
          telemetryById,
        };
      }
    } catch {
      // Fall back cleanly if offline
    }

    return {
      date: dateKey,
      fetchedAt: Date.now(),
      source: 'Local Verified Benchmark Profiles (Offline)',
      telemetryById,
    };
  });
}

// ============================================================================
// API Key Handlers
// ============================================================================

export function registerApiKeyHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.KEYS_LIST, async () => {
    const keys = getApiKeys();
    const now = Date.now();
    // Auto-populate missing AI providers in the background (throttled so deletes/refreshes stay instant)
    if (now - lastKeysSyncAt > 30_000) {
      lastKeysSyncAt = now;
      void (async () => {
        for (const entry of keys) {
          try {
            let secret = await getStoredApiKey(entry.providerId, entry.keyName);
            if (!secret && entry.encryptedKey && !entry.encryptedKey.startsWith('encrypted:')) {
              secret = await decrypt(entry.encryptedKey).catch(() => null);
            }
            if (secret) {
              await ensureProviderForKey(secret, entry.providerId, entry.keyName, false);
            }
          } catch {}
        }
      })();
    }
    return keys.map(sanitizeApiKeyForIpc);
  });

  ipcMain.handle(IPC_CHANNELS.KEYS_CREATE, async (_event, input) => {
    invalidateCandidatePoolCache();
    const validated = validateInput(createApiKeyInputSchema, input);
    const { profile } = await ensureProviderForKey(validated.key, validated.providerId, validated.keyName, true);
    const resolvedProviderId = profile.providerId;

    // Store in local credential vault and encrypt for local SQLite database persistence
    await storeApiKey(resolvedProviderId, validated.keyName, validated.key);
    const encryptedKey = await encrypt(validated.key);

    // Store encrypted key directly in local SQLite database
    const entry = createApiKey({
      providerId: resolvedProviderId,
      keyName: validated.keyName,
      key: encryptedKey,
      encryptedKey,
    } as any);
    return sanitizeApiKeyForIpc(entry);
  });

  ipcMain.handle(IPC_CHANNELS.KEYS_DELETE, async (_event, id) => {
    invalidateCandidatePoolCache();
    const entry = getApiKey(id);
    const deleted = deleteApiKey(id);

    if (entry) {
      const normalizedKeyName = (entry.keyName || '').trim().toLowerCase();
      // Clean up auto-created AI provider matching this deleted key's name
      const remaining = getApiKeys().filter(k => k.id !== id);
      const stillReferenced = remaining.some(
        k => (k.keyName || '').trim().toLowerCase() === normalizedKeyName && k.providerId === entry.providerId
      );
      if (!stillReferenced) {
        const autoProv = getProviders().find(
          p => (p.name || '').trim().toLowerCase() === normalizedKeyName && p.type === entry.providerId
        );
        if (autoProv) {
          providerManager.unregisterProvider(autoProv.id);
          deleteProvider(autoProv.id);
        }
      }

      // Clean OS keychain / fallback store without blocking or throwing on locked/missing vault entries
      void Promise.race([
        deleteStoredApiKey(entry.providerId, entry.keyName).catch(() => false),
        new Promise<void>(resolve => setTimeout(resolve, 1500)),
      ]);
    }
    return deleted;
  });

  ipcMain.handle(IPC_CHANNELS.KEYS_VALIDATE, async (_event, id) => {
    const entry = getApiKey(id);
    if (!entry) return { valid: false, error: 'Key not found' };

    let key = await getStoredApiKey(entry.providerId, entry.keyName);
    if (!key && entry.encryptedKey && !entry.encryptedKey.startsWith('encrypted:')) {
      try {
        key = await decrypt(entry.encryptedKey);
      } catch {}
    }
    if (!key) return { valid: false, error: 'Key secret not found in secure storage' };

    const { profile } = await ensureProviderForKey(key, entry.providerId, entry.keyName, true);
    const resolvedType = profile.providerId;

    let valid = false;
    let errorMsg: string | undefined;

    try {
      if (resolvedType === 'google') {
        const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
          headers: { 'x-goog-api-key': key },
        });
        valid = resp.ok;
        if (!valid) errorMsg = `Google API rejected key (Status ${resp.status})`;
      } else if (resolvedType === 'openai') {
        const resp = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
        });
        valid = resp.ok;
        if (!valid) errorMsg = `OpenAI API rejected key (Status ${resp.status})`;
      } else if (resolvedType === 'anthropic') {
        const resp = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
          },
        });
        valid = resp.ok;
        if (!valid) errorMsg = `Anthropic API rejected key (Status ${resp.status})`;
      } else if (resolvedType === 'openrouter' || resolvedType === 'custom') {
        if (profile.baseUrl?.includes('elevenlabs.io')) {
          const resp = await fetch('https://api.elevenlabs.io/v1/user', {
            headers: { 'xi-api-key': key },
          });
          valid = resp.ok;
          if (!valid) errorMsg = `ElevenLabs API rejected key (Status ${resp.status})`;
        } else {
          const configured = providerManager.getProviderForKeyProfile(resolvedType, key);
          const rawBase = profile.baseUrl || configured?.getProvider().config?.baseUrl || '';
          if (!rawBase) {
            valid = true;
          } else {
            const clean = rawBase.trim().replace(/\/+$/, '');
            const modelsUrl = clean.endsWith('/v1') ? `${clean}/models` : `${clean}/v1/models`;
            const resp = await fetch(modelsUrl, {
              headers: { Authorization: `Bearer ${key}` },
            });
            valid = resp.ok;
            if (!valid) errorMsg = `Endpoint rejected key (Status ${resp.status})`;
          }
        }
      } else {
        valid = true;
      }
    } catch (err: any) {
      valid = false;
      errorMsg = err.message || 'Validation request failed';
    }

    updateApiKeyValidation(id, valid);
    return { valid, error: errorMsg };
  });
}

// ============================================================================
// Work Mode Handlers
// ============================================================================

export function registerWorkspaceHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.WORKSPACE_SELECT, async () => {
    const parentWin = BrowserWindow.getFocusedWindow() || (global as any).mainWindow || undefined;
    const dialogOpts: Electron.OpenDialogOptions = {
      properties: ['openDirectory'],
      title: 'Select Project Workspace',
      buttonLabel: 'Select Folder',
    };
    const result = parentWin
      ? await dialog.showOpenDialog(parentWin, dialogOpts)
      : await dialog.showOpenDialog(dialogOpts);

    if (result.canceled || result.filePaths.length === 0) return null;

    const workspacePath = path.resolve(result.filePaths[0]);
    const workspaceName = path.basename(workspacePath) || workspacePath;

    // Check if workspace already exists
    let workspace = getWorkspaceByPath(workspacePath);
    if (!workspace) {
      workspace = createWorkspace({
        path: workspacePath,
        name: workspaceName,
        permissionLevel: currentConfig.permissionLevel,
        metadata: {},
      });
    }

    // Update recent workspaces (do NOT auto-create a .exco folder inside user directory)
    currentConfig.recentWorkspaces = [
      workspacePath,
      ...currentConfig.recentWorkspaces.filter(p => p !== workspacePath),
    ].slice(0, 10);

    activeWorkspace = workspace;
    addAllowedWorkspacePath(workspacePath);
    currentConfig.workspacePath = workspacePath;
    currentConfig.mode = 'work';

    return workspace;
  });

  ipcMain.handle(IPC_CHANNELS.WORKSPACE_LIST_RECENT, async () => {
    return getWorkspaces().filter(w => Boolean(w?.path && fsSync.existsSync(w.path)));
  });

  ipcMain.handle(IPC_CHANNELS.WORKSPACE_OPEN, async (_event, workspaceIdOrPath) => {
    const resolvedInput = typeof workspaceIdOrPath === 'string' && workspaceIdOrPath.length > 0
      ? path.resolve(workspaceIdOrPath)
      : workspaceIdOrPath;
    const workspace =
      getWorkspace(workspaceIdOrPath) ||
      getWorkspaceByPath(workspaceIdOrPath) ||
      (typeof resolvedInput === 'string' ? getWorkspaceByPath(resolvedInput) : null);
    if (!workspace) throw new Error('Workspace not found');

    activeWorkspace = workspace;
    addAllowedWorkspacePath(workspace.path);
    currentConfig.workspacePath = workspace.path;
    currentConfig.mode = 'work';

    return workspace;
  });

  ipcMain.handle('workspace:set-allowed-paths', async (_event, paths: string[]) => {
    const clean = Array.isArray(paths)
      ? Array.from(new Set(paths.filter(p => typeof p === 'string' && p.trim().length > 0).map(p => path.resolve(p))))
      : [];
    allowedWorkspacePaths = clean;
    if (clean.length > 0) {
      const primary = getWorkspaceByPath(clean[0]);
      if (primary) {
        activeWorkspace = primary;
      }
      currentConfig.workspacePath = clean[0];
    } else {
      activeWorkspace = null;
      currentConfig.workspacePath = undefined;
    }
    return allowedWorkspacePaths;
  });

  ipcMain.handle('workspace:list-projects', async () => {
    const raw = getSetting<any[]>('work:projects', []);
    if (!Array.isArray(raw)) return [];
    let changed = false;
    const pruned = raw.map(proj => {
      if (!proj || !Array.isArray(proj.folders)) return proj;
      const existingFolders = proj.folders.filter((f: any) => f?.path && fsSync.existsSync(f.path));
      if (existingFolders.length !== proj.folders.length) {
        changed = true;
        return { ...proj, folders: existingFolders };
      }
      return proj;
    });
    if (changed) {
      setSetting('work:projects', pruned);
    }
    return pruned;
  });

  ipcMain.handle('workspace:save-projects', async (_event, projects: any[]) => {
    setSetting('work:projects', Array.isArray(projects) ? projects : []);
    return true;
  });

  ipcMain.handle('workspace:delete-db-entry', async (_event, workspaceId: string) => {
    // Only deletes record from EXCO's SQLite database; NEVER deletes folders/files on PC
    if (!workspaceId) return false;
    return deleteWorkspace(workspaceId);
  });

  ipcMain.handle(IPC_CHANNELS.WORKSPACE_CLOSE, async () => {
    activeWorkspace = null;
    allowedWorkspacePaths = [];
    currentConfig.workspacePath = undefined;
    currentConfig.mode = 'chatbot';

    // Close all terminal sessions
    for (const [id, { pty }] of terminalSessions) {
      pty.kill();
    }
    terminalSessions.clear();

    // Close file watchers
    for (const watcher of fileWatchers.values()) {
      watcher.close();
    }
    fileWatchers.clear();
  });
}

// ============================================================================
// File System Handlers
// ============================================================================

export function registerFileSystemHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.FS_READ_DIR, async (_event, dirPath) => {
    if (!validateWorkspaceAccess(dirPath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const nodes: FileSystemNode[] = [];

      for (const entry of entries) {
        if (entry.name === 'System Volume Information' || entry.name === '$RECYCLE.BIN') continue;
        const fullPath = path.join(dirPath, entry.name);
        let stats: any = null;
        try {
          stats = await fs.stat(fullPath);
        } catch {
          try {
            stats = await fs.lstat(fullPath);
          } catch {
            continue;
          }
        }

        const isDir = entry.isDirectory() || Boolean(stats?.isDirectory?.());
        const isFile = !isDir && (entry.isFile() || Boolean(stats?.isFile?.()));

        nodes.push({
          path: fullPath,
          name: entry.name,
          type: isDir ? 'directory' : entry.isSymbolicLink() ? 'symlink' : 'file',
          size: isFile ? stats?.size : undefined,
          modifiedAt: stats?.mtimeMs || Date.now(),
          createdAt: stats?.birthtimeMs || Date.now(),
          extension: isFile ? path.extname(entry.name).slice(1) : undefined,
          isBinary: isFile ? isBinaryFile(entry.name) : undefined,
        });
      }

      // Sort: directories first, then files, alphabetically
      nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      return nodes;
    } catch (error) {
      throw new Error(`Failed to read directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_READ_FILE, async (_event, filePath) => {
    if (!validateWorkspaceAccess(filePath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      const stats = await fs.stat(filePath);
      if (stats.size > MAX_FILE_SIZE_FOR_EDIT) {
        throw new Error('File too large to edit');
      }

      const content = await fs.readFile(filePath, 'utf8');
      return { content, encoding: 'utf8' };
    } catch (error) {
      if (error instanceof Error && error.message.includes('too large')) throw error;
      // Try reading as binary/base64 for binary files
      try {
        const buffer = await fs.readFile(filePath);
        return { content: buffer.toString('base64'), encoding: 'base64' };
      } catch {
        throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_WRITE_FILE, async (_event, { path: filePath, content, encoding = 'utf8' }) => {
    if (!validateWorkspaceAccess(filePath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      // Atomic write: write to temp file then rename
      const tempPath = filePath + '.tmp';
      if (encoding === 'base64') {
        await fs.writeFile(tempPath, Buffer.from(content, 'base64'));
      } else {
        await fs.writeFile(tempPath, content, encoding);
      }
      await fs.rename(tempPath, filePath);
    } catch (error) {
      throw new Error(`Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  ipcMain.handle('fs:exists', async (_event, targetPath: string) => {
    if (!targetPath || !validateWorkspaceAccess(targetPath)) {
      return { exists: false, isDirectory: false };
    }
    try {
      const stats = await fs.stat(targetPath);
      return { exists: true, isDirectory: stats.isDirectory() };
    } catch {
      return { exists: false, isDirectory: false };
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_DELETE, async (_event, targetPath) => {
    if (!validateWorkspaceAccess(targetPath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      const resolved = path.resolve(targetPath);
      if (typeof shell?.trashItem === 'function') {
        await shell.trashItem(resolved);
      } else {
        const stats = await fs.stat(resolved);
        if (stats.isDirectory()) {
          await fs.rm(resolved, { recursive: true });
        } else {
          await fs.unlink(resolved);
        }
      }
    } catch (error) {
      throw new Error(`Failed to move to Recycle Bin: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_RENAME, async (_event, { oldPath, newPath }) => {
    if (!validateWorkspaceAccess(oldPath) || !validateWorkspaceAccess(newPath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      await fs.rename(oldPath, newPath);
    } catch (error) {
      throw new Error(`Failed to rename: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_CREATE_DIR, async (_event, dirPath) => {
    if (!validateWorkspaceAccess(dirPath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_WATCH, async (_event, targetPath) => {
    if (!validateWorkspaceAccess(targetPath)) {
      throw new Error('Access denied: path outside workspace');
    }

    if (fileWatchers.has(targetPath)) return;

    try {
      const watcher = fsSync.watch(targetPath, { recursive: true }, (eventType, filename) => {
        if (filename) {
          sendToRenderer('fs:changed', { path: targetPath, eventType, filename });
        }
      });
      watcher.on('error', () => {
        fileWatchers.delete(targetPath);
      });
      fileWatchers.set(targetPath, watcher);
    } catch (error) {
      throw new Error(`Failed to watch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  ipcMain.handle(IPC_CHANNELS.FS_UNWATCH, async (_event, targetPath) => {
    const watcher = fileWatchers.get(targetPath);
    if (watcher) {
      watcher.close();
      fileWatchers.delete(targetPath);
    }
  });
}

// ============================================================================
// Terminal Handlers
// ============================================================================

export function registerTerminalHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.TERMINAL_CREATE, async (_event, { workspaceId, cwd, cols, rows }) => {
    const workspace = getWorkspace(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    const shellCmd = getDefaultShell();
    const workingDir = cwd && validateWorkspaceAccess(cwd) ? cwd : workspace.path;

    const session: TerminalSession = {
      id: generateId(),
      workspaceId,
      name: `Terminal ${terminalSessions.size + 1}`,
      shell: shellCmd,
      cwd: workingDir,
      createdAt: now(),
      cols,
      rows,
    };

    let ptyProcess: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodePty = require('node-pty');
      if (nodePty && typeof nodePty.spawn === 'function') {
        ptyProcess = nodePty.spawn(shellCmd, [], {
          cwd: workingDir,
          cols: cols || 80,
          rows: rows || 24,
          name: 'xterm-256color',
        });
        ptyProcess.onData((data: string) => {
          sendToRenderer(IPC_CHANNELS.TERMINAL_ON_DATA, { sessionId: session.id, data });
        });
        ptyProcess.onExit(({ exitCode }: { exitCode: number }) => {
          sendToRenderer(IPC_CHANNELS.TERMINAL_ON_EXIT, { sessionId: session.id, code: exitCode });
          terminalSessions.delete(session.id);
        });
      }
    } catch (err) {
      console.warn('node-pty unavailable, terminal session created without PTY:', err);
    }

    terminalSessions.set(session.id, { pty: ptyProcess, session });

    return session;
  });

  ipcMain.handle(IPC_CHANNELS.TERMINAL_RESIZE, async (_event, { sessionId, cols, rows }) => {
    const entry = terminalSessions.get(sessionId);
    if (!entry) throw new Error('Terminal session not found');

    entry.session.cols = cols;
    entry.session.rows = rows;

    if (entry.pty) {
      entry.pty.resize(cols, rows);
    }
  });

  ipcMain.handle(IPC_CHANNELS.TERMINAL_WRITE, async (_event, { sessionId, data }) => {
    const entry = terminalSessions.get(sessionId);
    if (!entry) throw new Error('Terminal session not found');

    if (entry.pty) {
      entry.pty.write(data);
    }
  });

  ipcMain.handle(IPC_CHANNELS.TERMINAL_CLOSE, async (_event, sessionId) => {
    const entry = terminalSessions.get(sessionId);
    if (!entry) throw new Error('Terminal session not found');

    if (entry.pty) {
      entry.pty.kill();
    }
    terminalSessions.delete(sessionId);
  });
}

// ============================================================================
// Settings Handlers
// ============================================================================

export function registerSettingsHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, async () => {
    return getSettings();
  });

  ipcMain.handle(IPC_CHANNELS.SETTINGS_SET, async (_event, updates) => {
    const validated = validateInput(settingsSchema, updates);
    return updateSettings(validated);
  });
}

// ============================================================================
// MCP Handlers
// ============================================================================

export function registerMcpHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.MCP_LIST_SERVERS, async () => {
    return getMcpServers();
  });

  ipcMain.handle(IPC_CHANNELS.MCP_CREATE_SERVER, async (_event, input) => {
    const validated = validateInput(createMcpServerInputSchema, input);
    return createMcpServer(validated as any);
  });

  ipcMain.handle(IPC_CHANNELS.MCP_UPDATE_SERVER, async (_event, { id, updates }) => {
    const validated = validateInput(updateMcpServerInputSchema, { id, updates });
    return updateMcpServer(validated.id, validated.updates as any);
  });

  ipcMain.handle(IPC_CHANNELS.MCP_DELETE_SERVER, async (_event, id) => {
    await disconnectMCPServer(id).catch(() => {});
    return deleteMcpServer(id);
  });

  ipcMain.handle(IPC_CHANNELS.MCP_CONNECT, async (_event, serverId) => {
    const server = getMcpServer(serverId);
    if (!server) return { success: false, tools: [], error: 'Server not found' };

    try {
      const existing = getMCPClient(serverId);
      if (existing?.isConnected()) {
        return { success: true, tools: existing.getTools() };
      }
      if (existing) {
        await disconnectMCPServer(serverId).catch(() => {});
      }
      createMCPClient(server);
      return await connectMCPServer(serverId);
    } catch (error) {
      return { success: false, tools: [], error: error instanceof Error ? error.message : 'Connection failed' };
    }
  });

  ipcMain.handle(IPC_CHANNELS.MCP_DISCONNECT, async (_event, serverId) => {
    await disconnectMCPServer(serverId);
  });

  ipcMain.handle(IPC_CHANNELS.MCP_CALL_TOOL, async (_event, { serverId, toolName, args }) => {
    return callMCPTool(serverId, toolName, args || {});
  });
}

// ============================================================================
// Governance Handlers
// ============================================================================

export function registerGovernanceHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.GOVERNANCE_READ, async (_event, filename) => {
    if (!activeWorkspace) throw new Error('No active workspace');

    // First check database
    const dbContent = getGovernanceFile(activeWorkspace.path, filename);
    if (dbContent) return dbContent;

    // Fallback to file system
    const filePath = path.join(activeWorkspace.path, EXCO_FOLDER_NAME, filename);
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return '';
    }
  });

  ipcMain.handle(IPC_CHANNELS.GOVERNANCE_WRITE, async (_event, { file: filename, content }) => {
    if (!activeWorkspace) throw new Error('No active workspace');

    // Write to database
    setGovernanceFile(activeWorkspace.path, filename, content);

    // Also write to file system for persistence
    const excoPath = await ensureExcoFolder(activeWorkspace.path);
    const filePath = path.join(excoPath, filename);
    await fs.writeFile(filePath, content, 'utf8');

    // Notify renderer of change
    sendToRenderer('governance:changed', { filename, content });
  });

  ipcMain.handle(IPC_CHANNELS.GOVERNANCE_WATCH, async (_event, filename) => {
    if (!activeWorkspace) throw new Error('No active workspace');

    const filePath = path.join(activeWorkspace.path, EXCO_FOLDER_NAME, filename);
    try {
      const watcher = fsSync.watch(filePath, (eventType) => {
        if (eventType === 'change') {
          fs.readFile(filePath, 'utf8').then(content => {
            setGovernanceFile(activeWorkspace!.path, filename, content);
            sendToRenderer('governance:changed', { filename, content });
          });
        }
      });
      fileWatchers.set(`governance:${filename}`, watcher);
    } catch {
      // File might not exist yet
    }
  });

  ipcMain.handle(IPC_CHANNELS.GOVERNANCE_UNWATCH, async (_event, filename) => {
    const watcher = fileWatchers.get(`governance:${filename}`);
    if (watcher) {
      watcher.close();
      fileWatchers.delete(`governance:${filename}`);
    }
  });
}

// ============================================================================
// Window Handlers
// ============================================================================

export function registerWindowHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
    global.mainWindow?.minimize();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
    if (!global.mainWindow) return false;
    if (global.mainWindow.isMaximized()) {
      global.mainWindow.unmaximize();
      return false;
    } else {
      global.mainWindow.maximize();
      return true;
    }
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_IS_MAXIMIZED, () => {
    return global.mainWindow?.isMaximized() || false;
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, () => {
    global.mainWindow?.close();
  });
}

// ============================================================================
// Autonomous Workspace Agent Handlers
// ============================================================================

export function registerWorkAgentHandlers(): void {
  ipcMain.handle('work:run-agent', async (_event, input) => {
    return runWorkspaceAgent(input);
  });

  ipcMain.handle('work:approve-action', async (_event, input: { runId: string; stepId: string; decision: ApprovalDecision }) => {
    return resolveWorkspaceApproval(input.runId, input.stepId, input.decision);
  });

  ipcMain.handle('work:cancel-agent', async (_event, runId: string) => {
    return cancelWorkspaceAgent(runId);
  });
}

// ============================================================================
// AI Skills Registry Handlers
// ============================================================================

export function registerSkillHandlers(): void {
  ipcMain.handle('skills:sync-state', (_event, overrides) => {
    return syncSkillOverrides(overrides || {});
  });

  ipcMain.handle('skills:search', (_event, input: { query?: string; category?: string; limit?: number }) => {
    return searchActiveSkills(input?.query || '', input?.category, input?.limit || 20);
  });

  ipcMain.handle('skills:list', () => {
    return getActiveSkills().map(({ id, name, category, categorySlug, subcategory, description, builtIn }) => ({
      id,
      name,
      category,
      categorySlug,
      subcategory,
      description,
      builtIn,
    }));
  });
}

// ============================================================================
// Register All Handlers
// ============================================================================

export function registerAllIpcHandlers(): void {
  registerWindowHandlers();
  registerAppHandlers();
  registerChatHandlers();
  registerWorkAgentHandlers();
  registerSkillHandlers();
  registerProviderHandlers();
  registerApiKeyHandlers();
  registerWorkspaceHandlers();
  registerFileSystemHandlers();
  registerTerminalHandlers();
  registerSettingsHandlers();
  registerMcpHandlers();
  registerGovernanceHandlers();
}

// ============================================================================
// Helper: Binary file detection
// ============================================================================

function isBinaryFile(filename: string): boolean {
  const binaryExtensions = new Set([
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'tiff', 'webp', 'avif',
    'mp4', 'webm', 'mov', 'avi', 'mkv',
    'mp3', 'wav', 'flac', 'ogg', 'm4a',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'zip', 'tar', 'gz', 'rar', '7z',
    'exe', 'dll', 'so', 'dylib',
    'bin', 'dat', 'db', 'sqlite',
    'woff', 'woff2', 'ttf', 'eot',
  ]);
  const ext = path.extname(filename).slice(1).toLowerCase();
  return binaryExtensions.has(ext);
}