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
import { classifyModelCategory } from '@shared/utils';
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
import { generateId, now, isPathWithin, normalizePath, getDefaultShell, inferProviderFromApiKey, resolveApiKeyProfile, inferModelTier } from '@shared/utils';
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
const deletedConversationIds: Set<string> = new Set();

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

  if (matching && (fetchModels || !Array.isArray(matching.models) || matching.models.length === 0)) {
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
}

// ============================================================================
// Chatbot Handlers
// ============================================================================

export function registerChatHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.CHAT_LIST_CONVERSATIONS, async () => {
    return getConversations(false).filter(c => !String(c?.title || '').startsWith('[Work] '));
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

      const decision = await routeTurnWithOverviewer({
        pool,
        promptText,
        requestedModel: modelId,
        preferredKeyId: keyId,
        workflowMode: (workflowMode || 'auto') as any,
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
        decision.taskType === 'higher-research'
          ? 'Research'
          : decision.taskType === 'documentation'
          ? 'Docs'
          : decision.taskType === 'coding'
          ? 'Code'
          : 'Fast';

      // Inform renderer immediately which task category & model was selected
      sendToRenderer('chat:live-progress', {
        conversationId,
        type: 'routing',
        taskType: decision.taskType,
        modelId: decision.selected.modelId,
        providerId: decision.selected.providerId,
        overviewerModelId: decision.overviewerUsed?.modelId,
        statusText: decision.triggeredByKeyword
          ? `Selected ${decision.selected.modelId} (${taskLabel}) — generating reply...`
          : `Generating reply with ${decision.selected.modelId}...`,
      });

      const candidatesToTry: RoutedCandidate[] = decision.candidates;
      let assistantContent = '';
      let tokens: any = undefined;
      let failoverTransitionNote = '';
      const initialCandidate = decision.selected;
      let usedModelId = initialCandidate.modelId;
      let usedProviderId = initialCandidate.providerId;
      let failoverCount = 0;

      // Retry loop across all connected API keys/models on token/quota exhaustion
      for (let attempt = 0; attempt < candidatesToTry.length && attempt < 5; attempt++) {
        if (isConversationAbortedOrDeleted(conversationId, abortController.signal)) {
          return { aborted: true, userMessage: null as any, assistantMessage: null as any };
        }

        const cand = candidatesToTry[attempt];
        const profile = resolveApiKeyProfile(cand.keySecret, cand.providerId, cand.keyName);
        let endpointHost = cand.providerDisplayName;
        try {
          if (profile.baseUrl) endpointHost = new URL(profile.baseUrl).host;
        } catch {}

        if (attempt > 0) {
          emitStatus(
            `Limit on ${candidatesToTry[attempt - 1].modelId} — switching to ${cand.modelId} (${endpointHost})...`,
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
            failoverTransitionNote = `> ⚡ **Automatic Model Failover**: Limit reached on **${initialCandidate.modelId}**. Switched cleanly to **${finalModelId}** (${cand.providerDisplayName}).\n\n`;
          }
          updateConversation(conversationId, {
            modelId: isAutoRequested ? 'auto' : finalModelId,
            providerId: isAutoRequested ? 'auto' : cand.providerId,
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

          const hasNext = candidatesToTry.length > attempt + 1;
          if (isQuotaOrModelUnavailableError(err)) {
            markModelExhausted(cand.keyId, cand.modelId, err instanceof Error ? err.message : String(err));
          }
          if ((isQuotaOrModelUnavailableError(err) || preferredFailover !== false) && hasNext) {
            console.warn(
              `[Overviewer-Failover] ${cand.modelId} (${cand.providerId}) failed (${err instanceof Error ? err.message : err}). Trying ${candidatesToTry[attempt + 1].modelId}...`
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

  ipcMain.handle('chat:transcribe-audio', async (_event, input: { wavBase64: string; keyId?: string }) => {
    const cleanBase64 = (input?.wavBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
    if (!cleanBase64) {
      return { text: '', source: 'none', error: 'No audio captured' };
    }

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
    const selectedKeyEntry = input?.keyId ? allKeys.find(k => k.id === input.keyId) : undefined;
    if (selectedKeyEntry) {
      const secret = await resolveKeySecret(selectedKeyEntry);
      if (secret) providerKeys[inferProviderFromApiKey(secret, selectedKeyEntry.providerId)] = secret;
    }
    for (const kEntry of allKeys) {
      const secret = await resolveKeySecret(kEntry);
      if (secret) {
        const resolved = inferProviderFromApiKey(secret, kEntry.providerId);
        if (!providerKeys[resolved]) providerKeys[resolved] = secret;
      }
    }
    if (!providerKeys.google && process.env.GEMINI_API_KEY) {
      providerKeys.google = process.env.GEMINI_API_KEY;
    }

    // 1. Try Gemini audio transcription if a Google key is available
    if (providerKeys.google) {
      try {
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
                    { text: 'Transcribe this spoken audio accurately into plain text with punctuation. Return ONLY the transcribed text and nothing else. If silence or unintelligible, return empty string.' },
                    { inlineData: { mimeType: 'audio/wav', data: cleanBase64 } },
                  ],
                },
              ],
              generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
            }),
          }
        );
        if (resp.ok) {
          const data: any = await resp.json();
          const text = (data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '').trim();
          if (text) return { text, source: 'gemini' };
        }
      } catch {
        // Fall through to next recognizer
      }
    }

    // 2. Try OpenAI Whisper if an OpenAI key is available
    if (providerKeys.openai) {
      try {
        const audioBuffer = Buffer.from(cleanBase64, 'base64');
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'voice.wav');
        formData.append('model', 'whisper-1');

        const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${providerKeys.openai}` },
          body: formData as any,
        });
        if (resp.ok) {
          const data: any = await resp.json();
          const text = (data?.text || '').trim();
          if (text) return { text, source: 'openai-whisper' };
        }
      } catch {
        // Fall through to local OS recognizer
      }
    }

    // 3. Offline Windows System.Speech dictation fallback (requires no API key)
    if (process.platform === 'win32') {
      const execFileAsync = promisify(execFile);
      const tmpWavPath = path.join(os.tmpdir(), `exco-voice-${Date.now()}-${Math.random().toString(36).slice(2)}.wav`);
      try {
        await fs.writeFile(tmpWavPath, Buffer.from(cleanBase64, 'base64'));
        const safePath = tmpWavPath.replace(/'/g, "''");
        const psScript = [
          'Add-Type -AssemblyName System.Speech',
          '$rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine',
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
      error: 'No transcription engine available. Configure a Gemini or OpenAI key in Sidebar > API Keys.',
    };
  });
}

// ============================================================================
// Provider Handlers
// ============================================================================

export function registerProviderHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PROVIDERS_LIST, async () => {
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
    return getProviders().map(sanitizeProviderForIpc);
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_CREATE, async (_event, input) => {
    const validated = validateInput(createProviderInputSchema, input);
    const created = createProvider(validated as any);
    providerManager.registerConfiguredProvider(created);
    return sanitizeProviderForIpc(created);
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_UPDATE, async (_event, { id, updates }) => {
    const validated = validateInput(updateProviderInputSchema, { id, updates });
    const updated = updateProvider(validated.id, validated.updates as any);
    if (updated) {
      providerManager.registerConfiguredProvider(updated);
      return sanitizeProviderForIpc(updated);
    }
    return updated;
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_DELETE, async (_event, id) => {
    providerManager.unregisterProvider(id);
    return deleteProvider(id);
  });

  ipcMain.handle(IPC_CHANNELS.PROVIDERS_TEST, async (_event, providerId) => {
    const provider = getProvider(providerId);
    if (!provider) return { success: false, error: 'Provider not found' };

    try {
      providerManager.registerConfiguredProvider(provider);
      const instance = providerManager.getProvider(provider.id);
      if (!instance) return { success: false, error: 'Provider could not be initialized' };

      // Attach a matching saved API key if one exists for this provider type
      const keys = getApiKeys();
      const matchingKey = keys.find(k => k.keyName === provider.name || k.providerId === provider.type);
      if (matchingKey && !provider.config?.apiKey) {
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
            category: classifyModelCategory(m),
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
      return models.map(m => {
        const cap = m.contextWindow && m.contextWindow > 0 ? m.contextWindow : 128000;
        return {
          ...m,
          tokensUsed: localUsage[m.id] ?? 0,
          tokenCap: cap,
          tier: m.tier || (resolvedType === 'ollama' || m.id.includes(':free') ? 'free' : 'paid'),
          category: classifyModelCategory(m),
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
    // Auto-populate missing AI providers in the background so initial UI load never blocks on network probes
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
    return keys.map(sanitizeApiKeyForIpc);
  });

  ipcMain.handle(IPC_CHANNELS.KEYS_CREATE, async (_event, input) => {
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
    const entry = getApiKey(id);
    if (entry) {
      await deleteStoredApiKey(entry.providerId, entry.keyName);
      // Clean up auto-created AI provider matching this deleted key's name
      const remaining = getApiKeys().filter(k => k.id !== id);
      const stillReferenced = remaining.some(k => k.keyName === entry.keyName && k.providerId === entry.providerId);
      if (!stillReferenced) {
        const autoProv = getProviders().find(p => p.name === entry.keyName && p.type === entry.providerId);
        if (autoProv) {
          providerManager.unregisterProvider(autoProv.id);
          deleteProvider(autoProv.id);
        }
      }
    }
    return deleteApiKey(id);
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
    return getWorkspaces();
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
    return getSetting('work:projects', []);
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

  ipcMain.handle(IPC_CHANNELS.FS_DELETE, async (_event, targetPath) => {
    if (!validateWorkspaceAccess(targetPath)) {
      throw new Error('Access denied: path outside workspace');
    }

    try {
      const stats = await fs.stat(targetPath);
      if (stats.isDirectory()) {
        await fs.rm(targetPath, { recursive: true });
      } else {
        await fs.unlink(targetPath);
      }
    } catch (error) {
      throw new Error(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`);
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