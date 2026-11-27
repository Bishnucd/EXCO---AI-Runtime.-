/**
 * EXCO Overviewer & Keyword-Triggered Model Router
 *
 * - Zero prompt/route caching.
 * - Default messages (no trigger keyword in prompt) go straight to a single fast default model.
 * - When a specific workflow keyword is present in the prompt (e.g., research, documentation,
 *   coding, fast/turbo), the Overviewer selects the best model for that workflow across all
 *   connected API keys and fails over automatically on token/quota exhaustion.
 */

import { classifyModelCategory, inferModelTier, inferProviderFromApiKey, resolveApiKeyProfile, type ModelCategory, type WorkflowSelection } from '@shared/utils';
import type { ApiKeyEntry, AIProvider, Message } from '@shared/types';
import { getProviders, updateProvider } from '@main/database';
import { providerManager } from '@main/services/ai-providers';

export type RoutingTaskType = 'higher-research' | 'documentation' | 'coding' | 'fast-chat';

export interface RoutedCandidate {
  keyId: string;
  keyName: string;
  keySecret: string;
  providerId: string;
  providerDisplayName: string;
  modelId: string;
  modelName: string;
  category: ModelCategory;
  tier: 'free' | 'paid';
  speedScore: number;
  researchScore: number;
  documentationScore: number;
  codingScore: number;
  contextWindow: number;
}

export interface OverviewerDecision {
  taskType: RoutingTaskType;
  category: ModelCategory;
  triggeredByKeyword: boolean;
  triggerKeyword?: string;
  selected: RoutedCandidate;
  candidates: RoutedCandidate[];
  overviewerUsed?: {
    keyId: string;
    keyName: string;
    providerId: string;
    modelId: string;
  };
  overviewerReplaced: Array<{ modelId: string; providerId: string; reason: string }>;
  decisionMs: number;
  usedHeuristic: boolean;
  reason: string;
}

const EXHAUSTED_COOLDOWN_MS = 10 * 60 * 1000;
const OVERVIEWER_TIMEOUT_MS = 450;
const DISCOVERY_TIMEOUT_MS = 1600;

const exhaustedUntil = new Map<string, { until: number; reason: string }>();
let activeOverviewerKey: string | null = null;

function modelKey(keyId: string, modelId: string): string {
  return `${keyId}::${modelId}`;
}

export function clearRouterStateForTests(): void {
  exhaustedUntil.clear();
  activeOverviewerKey = null;
}

export function markModelExhausted(keyId: string, modelId: string, reason = 'quota'): void {
  if (!modelId) return;
  const k = modelKey(keyId || 'default', modelId);
  exhaustedUntil.set(k, { until: Date.now() + EXHAUSTED_COOLDOWN_MS, reason });
  if (activeOverviewerKey === k) {
    activeOverviewerKey = null;
  }
}

export function isModelExhausted(keyId: string, modelId: string): boolean {
  const k = modelKey(keyId || 'default', modelId);
  const entry = exhaustedUntil.get(k);
  if (!entry) return false;
  if (Date.now() > entry.until) {
    exhaustedUntil.delete(k);
    return false;
  }
  return true;
}

export function isQuotaOrModelUnavailableError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err || '')).toLowerCase();
  return (
    msg.includes('token') ||
    msg.includes('429') ||
    msg.includes('402') ||
    msg.includes('404') ||
    msg.includes('exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('rate_limit') ||
    msg.includes('resource_exhausted') ||
    msg.includes('insufficient') ||
    msg.includes('credit') ||
    msg.includes('balance') ||
    msg.includes('billing') ||
    msg.includes('context') ||
    msg.includes('capacity') ||
    msg.includes('overloaded') ||
    msg.includes('too many requests') ||
    msg.includes('timed out') ||
    msg.includes('not found') ||
    msg.includes('unavailable') ||
    msg.includes('decommissioned') ||
    msg.includes('deprecated')
  );
}

export function isNonChatUtilityModel(modelId: string, modelName = ''): boolean {
  const text = `${modelId} ${modelName}`.toLowerCase();
  if (text.trim() === 'auto') return false;
  return /(embed|embedqa|nv-embed|bge-|e5-|rerank|nemoretriever|arctic-embed|tts|whisper|transcribe|imagen|dall-e|flux|stable-diffusion|moderation|guard|shield|nemoguard|safety|topic-control|content-safety|parse|ocr|deplot|kosmos|audio|speech|realtime|live|robotics|gliner|pii|detector|synthetic-video|cosmos-|nvclip|riva-translate|ising-|calibration|starcoder2)/.test(
    text
  );
}

export function scoreCandidateForSpeed(params: {
  modelId: string;
  modelName?: string;
  providerId: string;
  baseUrl?: string;
  category: ModelCategory;
}): number {
  const text = `${params.modelId} ${params.modelName || ''}`.toLowerCase();
  const base = (params.baseUrl || '').toLowerCase();
  let score = 50;

  if (base.includes('groq.com')) score += 42;
  else if (base.includes('cerebras')) score += 45;
  else if (base.includes('sambanova')) score += 36;
  else if (params.providerId === 'google') score += 20;
  else if (base.includes('nvidia.com')) score += 14;
  else if (params.providerId === 'openai') score += 12;
  else if (params.providerId === 'anthropic') score += 10;

  if (/flash-lite|8b-instant|instant/.test(text)) score += 38;
  else if (/\b(flash|nano|mini|haiku|lite|8b|7b|4b|3b|2b|1b|small|fast|turbo|speed)\b/.test(text)) score += 28;
  else if (/\b(nemotron-mini|gemma-2-9b|gemma-3-4b|gemma-3-12b|phi-3|phi-4-mini|qwen-?2\.5-7b)\b/.test(text)) score += 26;

  if (/\b(70b|72b|32b|sonnet|gpt-4o)\b/.test(text) && !text.includes('mini')) score -= 12;
  if (/\b(opus|o1|o3|o4|r1|qwq|reasoner|thinking|ultra|405b|671b|235b|480b)\b/.test(text)) score -= 36;
  if (/[-_/]pro\b/.test(text) && !text.includes('flash')) score -= 24;
  if (params.category === 'turbo') score += 14;
  if (params.category === 'deep-thought') score -= 20;
  if (params.modelId === 'auto') score -= 25;

  return score;
}

export function scoreCandidateForTask(candidate: RoutedCandidate, taskType: RoutingTaskType): number {
  switch (taskType) {
    case 'higher-research':
      return candidate.researchScore;
    case 'documentation':
      return candidate.documentationScore;
    case 'coding':
      return candidate.codingScore;
    case 'fast-chat':
    default:
      return candidate.speedScore;
  }
}

export function computeTaskScores(params: {
  modelId: string;
  modelName?: string;
  providerId: string;
  baseUrl?: string;
  category: ModelCategory;
  supportsReasoning?: boolean;
  contextWindow?: number;
}): {
  speedScore: number;
  researchScore: number;
  documentationScore: number;
  codingScore: number;
} {
  const text = `${params.modelId} ${params.modelName || ''}`.toLowerCase();
  const ctxBonus = Math.min(18, Math.floor((params.contextWindow || 32000) / 32000) * 4);
  const speedScore = scoreCandidateForSpeed(params);

  let researchScore = 40 + ctxBonus;
  if (params.category === 'deep-thought') researchScore += 32;
  if (params.supportsReasoning) researchScore += 18;
  if (/\b(opus|o3|o1|o4|deepseek-r1|r1|qwq|thinking|reasoner|ultra)\b/.test(text)) researchScore += 30;
  if (/\b(gemini-2\.5-pro|gemini-3(\.\d+)?-pro|sonnet-4|sonnet-3[._-]7|405b|671b|235b)\b/.test(text)) researchScore += 26;
  if (/\b(llama-3\.3-70b|llama-3\.1-70b|nemotron-70b|gpt-4o|qwen-2\.5-72b|mistral-large)\b/.test(text) && !text.includes('mini')) {
    researchScore += 16;
  }
  if (/\b(8b|7b|4b|3b|1b|nano|mini|lite|haiku)\b/.test(text) && !/\b(o3-mini|o1-mini|r1-distill)\b/.test(text)) {
    researchScore -= 22;
  }

  let documentationScore = 45 + ctxBonus;
  if (/\b(claude|sonnet|gpt-4o|gemini-2\.5-pro|gemini-2\.5-flash|llama-3\.3-70b|qwen-2\.5-72b|mistral-large|command-r)\b/.test(text)) {
    documentationScore += 28;
  }
  if (params.category === 'standard') documentationScore += 14;
  if (params.category === 'deep-thought') documentationScore += 10;
  if (/\b(8b|7b|4b|3b|1b|nano)\b/.test(text)) documentationScore -= 14;
  if (/\b(r1|qwq|o1|o3)\b/.test(text)) documentationScore -= 6;

  let codingScore = 45 + Math.floor(ctxBonus * 0.6);
  if (/\b(coder|codestral|codellama|starcoder|deepseek-v3|deepseek-r1|sonnet|claude-3\.5|claude-sonnet|gpt-4o|o3-mini|qwen-2\.5-coder|llama-3\.3-70b|gemini-2\.5-pro)\b/.test(text)) {
    codingScore += 30;
  }
  if (params.category === 'deep-thought') codingScore += 12;
  if (params.category === 'standard') codingScore += 8;
  if (/\b(3b|2b|1b|nano)\b/.test(text)) codingScore -= 20;

  return { speedScore, researchScore, documentationScore, codingScore };
}

/**
 * Checks whether the prompt contains an explicit trigger keyword requiring Overviewer
 * workflow selection. Returns null for regular conversational turns with no trigger word.
 */
export function detectKeywordTrigger(params: {
  promptText: string;
  hasHeavyAttachments?: boolean;
  workflowMode?: WorkflowSelection;
  reasoningEffort?: string;
}): { taskType: RoutingTaskType; keyword: string } | null {
  const { promptText, hasHeavyAttachments, workflowMode, reasoningEffort } = params;
  const trimmed = (promptText || '').trim();
  const lower = trimmed.toLowerCase();

  if (workflowMode === 'turbo') return { taskType: 'fast-chat', keyword: 'workflow:turbo' };
  if (workflowMode === 'deep-thought' || reasoningEffort === 'high') {
    return { taskType: 'higher-research', keyword: 'workflow:deep-thought' };
  }
  if (workflowMode === 'standard') return { taskType: 'documentation', keyword: 'workflow:standard' };

  const docMatch = lower.match(
    /\b(documentation|document|readme|prd|spec|specification|technical guide|user guide|onboarding guide|manual|changelog|release notes|summarize|summary|report|whitepaper|proposal|write docs|api docs|@docs|#docs)\b/i
  );
  const researchMatch = lower.match(
    /\b(research|investigate|deep dive|architect|architecture|system design|analyze deeply|trade[- ]?offs|strategy|benchmark|security audit|mathematical proof|hypothesis|literature|root cause|synthesize|step[- ]by[- ]step reasoning|@research|#research)\b/i
  );
  const codeMatch =
    trimmed.includes('```')
      ? ['```']
      : lower.match(
          /\b(code|coding|debug|refactor|implement|typescript|javascript|python|rust|golang|sql|unit test|stack trace|@code|#code)\b/i
        );
  const fastMatch = lower.match(/\b(quick|fast|turbo|tldr|briefly|@fast|#fast)\b/i);

  if (docMatch && !researchMatch) {
    return { taskType: 'documentation', keyword: docMatch[0] };
  }
  if (researchMatch || hasHeavyAttachments) {
    return { taskType: 'higher-research', keyword: researchMatch?.[0] || 'heavy-attachment' };
  }
  if (codeMatch) {
    return { taskType: 'coding', keyword: codeMatch[0] };
  }
  if (fastMatch) {
    return { taskType: 'fast-chat', keyword: fastMatch[0] };
  }

  return null;
}

export function classifyTaskHeuristic(params: {
  promptText: string;
  hasHeavyAttachments?: boolean;
  hasAnyAttachment?: boolean;
  workflowMode?: WorkflowSelection;
  reasoningEffort?: string;
}): RoutingTaskType {
  const triggered = detectKeywordTrigger(params);
  if (triggered) return triggered.taskType;
  return 'fast-chat';
}

export function mapTaskTypeToCategory(taskType: RoutingTaskType): ModelCategory {
  switch (taskType) {
    case 'higher-research':
      return 'deep-thought';
    case 'documentation':
    case 'coding':
      return 'standard';
    case 'fast-chat':
    default:
      return 'turbo';
  }
}

function getFallbackModelsForProvider(
  providerId: string,
  baseUrl: string,
  defaultModel?: string
): Array<{ id: string; name: string; supportsReasoning?: boolean; contextWindow?: number }> {
  const models: Array<{ id: string; name: string; supportsReasoning?: boolean; contextWindow?: number }> = [];
  if (defaultModel && defaultModel !== 'default') {
    models.push({ id: defaultModel, name: defaultModel });
  }
  switch (providerId) {
    case 'google':
      models.push(
        { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', contextWindow: 1000000 },
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', contextWindow: 1000000 },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', supportsReasoning: true, contextWindow: 1000000 }
      );
      break;
    case 'openai':
      models.push(
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextWindow: 128000 },
        { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000 },
        { id: 'o3-mini', name: 'o3-mini', supportsReasoning: true, contextWindow: 200000 }
      );
      break;
    case 'anthropic':
      models.push(
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextWindow: 200000 },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', contextWindow: 200000 },
        { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', supportsReasoning: true, contextWindow: 200000 }
      );
      break;
    default:
      if (baseUrl.includes('groq.com')) {
        models.push(
          { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', contextWindow: 131072 },
          { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', contextWindow: 131072 }
        );
      } else if (baseUrl.includes('nvidia.com')) {
        models.push(
          { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', contextWindow: 128000 },
          { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', contextWindow: 128000 },
          { id: 'deepseek-ai/deepseek-r1', name: 'DeepSeek R1', supportsReasoning: true, contextWindow: 128000 }
        );
      }
      break;
  }
  const seen = new Set<string>();
  return models.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

function findMatchingDbProvider(
  providers: AIProvider[],
  entry: ApiKeyEntry,
  profile: ReturnType<typeof resolveApiKeyProfile>
): AIProvider | undefined {
  const targetBase = (profile.baseUrl || '').trim().replace(/\/+$/, '').toLowerCase();
  return providers.find(p => {
    if (entry.keyName && p.name?.trim().toLowerCase() === entry.keyName.trim().toLowerCase()) {
      return true;
    }
    const pBase = (p.config?.baseUrl || '').trim().replace(/\/+$/, '').toLowerCase();
    if (targetBase && pBase === targetBase) return true;
    if (profile.providerId !== 'custom' && p.type === profile.providerId) return true;
    return false;
  });
}

const keyPaidAccessCache = new Map<string, { allowed: boolean; checkedAt: number }>();
const KEY_PAID_CACHE_TTL_MS = 90 * 1000;

export async function checkKeyPaidAccess(
  providerId: string,
  secret: string,
  baseUrl?: string,
  usageData?: any
): Promise<boolean> {
  const cleanSecret = (secret || '').trim();
  const sLower = cleanSecret.toLowerCase();
  if (!cleanSecret) return false;
  if (
    providerId === 'ollama' ||
    sLower.startsWith('freellma') ||
    sLower.startsWith('nvapi-') ||
    sLower.startsWith('gsk_') ||
    sLower.startsWith('csk-')
  ) {
    return false;
  }

  if (usageData && typeof usageData === 'object') {
    if (usageData.paidAllowed === false || usageData.allowPaid === false) return false;
    if (String(usageData.tier || usageData.plan || '').toLowerCase() === 'free') return false;
    if (typeof usageData.limit_remaining === 'number' && usageData.limit_remaining <= 0 && usageData.is_free_tier === true) {
      return false;
    }
    if (typeof usageData.credit_balance === 'number' && usageData.credit_balance <= 0 && usageData.paidAllowed !== true) {
      return false;
    }
  }

  if (providerId === 'openrouter' || sLower.startsWith('sk-or-')) {
    const cacheKey = `openrouter:${cleanSecret.slice(0, 18)}`;
    const cached = keyPaidAccessCache.get(cacheKey);
    if (cached && Date.now() - cached.checkedAt < KEY_PAID_CACHE_TTL_MS) {
      return cached.allowed;
    }
    try {
      const endpoint = baseUrl && baseUrl.includes('openrouter')
        ? `${baseUrl.replace(/\/+$/, '').replace(/\/v1$/, '')}/v1/auth/key`
        : 'https://openrouter.ai/api/v1/auth/key';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const resp = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${cleanSecret}` },
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));
      if (resp.ok) {
        const json: any = await resp.json().catch(() => null);
        const d = json?.data || json;
        const remaining = d?.limit_remaining;
        const allowed = Boolean(
          d && (d.is_free_tier === false || (remaining !== null && remaining !== undefined && Number(remaining) > 0))
        );
        keyPaidAccessCache.set(cacheKey, { allowed, checkedAt: Date.now() });
        return allowed;
      }
      if (resp.status === 401 || resp.status === 403) {
        keyPaidAccessCache.set(cacheKey, { allowed: false, checkedAt: Date.now() });
        return false;
      }
    } catch {}
    // Do not permanently cache or hide models on transient offline/timeout errors
    return true;
  }

  return true;
}

/**
 * Collects live non-exhausted chat model candidates across ALL configured API keys (zero routing cache).
 */
export async function collectAllModelCandidates(
  allKeys: ApiKeyEntry[],
  resolveKeySecret: (entry: ApiKeyEntry) => Promise<string | null>,
  signal?: AbortSignal
): Promise<RoutedCandidate[]> {
  const dbProviders = getProviders();
  const candidates: RoutedCandidate[] = [];
  const seenKeyModel = new Set<string>();

  const effectiveEntries: Array<{ entry: ApiKeyEntry; secret: string }> = [];
  for (const kEntry of allKeys) {
    if (signal?.aborted) break;
    const secret = await resolveKeySecret(kEntry);
    if (secret) {
      effectiveEntries.push({ entry: kEntry, secret });
    }
  }

  if (effectiveEntries.length === 0 && process.env.GEMINI_API_KEY) {
    effectiveEntries.push({
      entry: {
        id: 'env-gemini',
        providerId: 'google',
        keyName: 'Gemini Env',
        encryptedKey: '',
        createdAt: 0,
        isValid: true,
      },
      secret: process.env.GEMINI_API_KEY,
    });
  }

  await Promise.all(
    effectiveEntries.map(async ({ entry, secret }) => {
      if (signal?.aborted) return;
      const profile = resolveApiKeyProfile(secret, entry.providerId, entry.keyName);
      const resolvedProviderId = inferProviderFromApiKey(secret, profile.providerId);
      const dbProv = findMatchingDbProvider(dbProviders, entry, profile);

      let rawModels: any[] = [];
      if (dbProv?.models && dbProv.models.length > 0) {
        rawModels = dbProv.models;
      } else {
        const isFreeLlm = secret.trim().startsWith('freellma');
        if (!isFreeLlm) {
          try {
            const inst =
              (dbProv ? providerManager.getProvider(dbProv.id) : undefined) ||
              providerManager.getProviderForKeyProfile(resolvedProviderId, secret);
            if (inst) {
              inst.updateConfig({
                apiKey: secret,
                ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
              });
              const fetched = await Promise.race<any[]>([
                inst.listModels(),
                new Promise<any[]>(resolve => setTimeout(() => resolve([]), DISCOVERY_TIMEOUT_MS)),
              ]);
              if (Array.isArray(fetched) && fetched.length > 0) {
                rawModels = fetched;
                if (dbProv) {
                  try {
                    updateProvider(dbProv.id, { models: fetched });
                  } catch {}
                }
              }
            }
          } catch {}
        }
      }

      if (rawModels.length === 0) {
        rawModels = getFallbackModelsForProvider(resolvedProviderId, profile.baseUrl, profile.defaultModel);
      }

      const keyAllowsPaid = await checkKeyPaidAccess(resolvedProviderId, secret, profile.baseUrl);

      for (const m of rawModels) {
        const mId = String(m?.id || '').trim();
        if (!mId) continue;
        if (isNonChatUtilityModel(mId, m?.name || '')) continue;

        const dedupeKey = modelKey(entry.id, mId);
        if (seenKeyModel.has(dedupeKey)) continue;
        seenKeyModel.add(dedupeKey);

        if (isModelExhausted(entry.id, mId)) continue;

        const resolvedTier = m?.tier || inferModelTier(m, profile, secret);
        if (resolvedTier === 'paid' && !keyAllowsPaid) continue;

        const category = classifyModelCategory(m);
        const scores = computeTaskScores({
          modelId: mId,
          modelName: m?.name,
          providerId: resolvedProviderId,
          baseUrl: profile.baseUrl,
          category,
          supportsReasoning: m?.supportsReasoning,
          contextWindow: m?.contextWindow,
        });

        candidates.push({
          keyId: entry.id,
          keyName: entry.keyName || profile.displayName,
          keySecret: secret,
          providerId: resolvedProviderId,
          providerDisplayName: entry.keyName || profile.displayName,
          modelId: mId,
          modelName: m?.name || mId,
          category,
          tier: resolvedTier,
          contextWindow: m?.contextWindow || 32000,
          ...scores,
        });
      }
    })
  );

  return candidates;
}

export function getOverviewerCandidates(pool: RoutedCandidate[]): RoutedCandidate[] {
  const chatCandidates = pool.filter(c => c.modelId !== 'auto');
  const usable = chatCandidates.length > 0 ? chatCandidates : pool;
  const sorted = [...usable].sort((a, b) => b.speedScore - a.speedScore);

  if (activeOverviewerKey) {
    const pinnedIdx = sorted.findIndex(c => modelKey(c.keyId, c.modelId) === activeOverviewerKey);
    if (pinnedIdx > 0) {
      const [pinned] = sorted.splice(pinnedIdx, 1);
      sorted.unshift(pinned);
    }
  }
  return sorted;
}

function createLinkedSignal(parentSignal: AbortSignal | undefined, timeoutMs: number): {
  signal: AbortSignal;
  cleanup: () => void;
  didTimeout: () => boolean;
} {
  const controller = new AbortController();
  let timedOut = false;

  const onParentAbort = () => controller.abort();
  if (parentSignal) {
    if (parentSignal.aborted) {
      controller.abort();
    } else {
      parentSignal.addEventListener('abort', onParentAbort, { once: true });
    }
  }

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      clearTimeout(timer);
      if (parentSignal) {
        parentSignal.removeEventListener('abort', onParentAbort);
      }
    },
  };
}

function buildCompactSlateForOverviewer(pool: RoutedCandidate[]): RoutedCandidate[] {
  const chosen: RoutedCandidate[] = [];
  const seen = new Set<string>();
  const addTop = (task: RoutingTaskType, count: number) => {
    const sorted = [...pool]
      .filter(c => c.modelId !== 'auto')
      .sort((a, b) => scoreCandidateForTask(b, task) - scoreCandidateForTask(a, task));
    let added = 0;
    for (const c of sorted) {
      if (added >= count) break;
      const k = `${c.providerId}::${c.modelId}`;
      if (seen.has(k)) continue;
      seen.add(k);
      chosen.push(c);
      added++;
    }
  };

  addTop('higher-research', 2);
  addTop('documentation', 2);
  addTop('coding', 2);
  addTop('fast-chat', 2);
  return chosen;
}

function parseOverviewerReply(
  raw: string,
  slateCount: number
): { taskType?: RoutingTaskType; candidateIndex?: number } | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/```json|```/gi, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  const jsonStr = match ? match[0] : cleaned;
  try {
    const parsed = JSON.parse(jsonStr);
    const rawTask = String(parsed.t || parsed.task || '').toLowerCase();
    let taskType: RoutingTaskType | undefined;
    if (rawTask.includes('research') || rawTask.includes('deep')) taskType = 'higher-research';
    else if (rawTask.includes('doc') || rawTask.includes('writ') || rawTask.includes('summ')) taskType = 'documentation';
    else if (rawTask.includes('cod') || rawTask.includes('dev')) taskType = 'coding';
    else if (rawTask.includes('fast') || rawTask.includes('quick') || rawTask.includes('chat')) taskType = 'fast-chat';

    const idx = typeof parsed.i === 'number' ? parsed.i : Number.parseInt(String(parsed.i ?? ''), 10);
    const candidateIndex = Number.isFinite(idx) && idx >= 0 && idx < slateCount ? idx : undefined;
    if (!taskType && candidateIndex === undefined) return null;
    return { taskType, candidateIndex };
  } catch {
    return null;
  }
}

export type OverviewerInvoker = (params: {
  candidate: RoutedCandidate;
  systemPrompt: string;
  userPrompt: string;
  signal: AbortSignal;
}) => Promise<string>;

async function defaultOverviewerInvoker({
  candidate,
  systemPrompt,
  userPrompt,
  signal,
}: Parameters<OverviewerInvoker>[0]): Promise<string> {
  const profile = resolveApiKeyProfile(candidate.keySecret, candidate.providerId, candidate.keyName);
  const inst = providerManager.getProviderForKeyProfile(candidate.providerId, candidate.keySecret);
  if (!inst) throw new Error(`Provider unavailable: ${candidate.providerId}`);

  inst.updateConfig({
    apiKey: candidate.keySecret,
    ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
  });

  const userMsg: Message = {
    id: `ov-${Date.now()}`,
    conversationId: 'overviewer',
    role: 'user',
    content: userPrompt,
    createdAt: Date.now(),
    status: 'complete',
  };

  const res = await providerManager.complete(inst.getId(), {
    model: candidate.modelId,
    systemPrompt,
    messages: [userMsg],
    temperature: 0,
    maxTokens: 48,
    signal,
  });
  return res?.content || '';
}

function classifyTaskForSummary(c: RoutedCandidate): RoutingTaskType {
  if (c.researchScore >= c.speedScore && c.researchScore >= c.documentationScore) return 'higher-research';
  if (c.documentationScore >= c.speedScore) return 'documentation';
  if (c.codingScore >= c.speedScore) return 'coding';
  return 'fast-chat';
}

/**
 * Routes a chat turn without any caching:
 * - Manual model: uses chosen model + failover chain.
 * - Auto mode with NO trigger keyword: runs directly on the single fastest base model.
 * - Auto mode WITH a trigger keyword (or explicit workflow): activates the Overviewer model
 *   to pick the right model for that workflow, failing over automatically on quota limits.
 */
export async function routeTurnWithOverviewer(params: {
  pool: RoutedCandidate[];
  promptText: string;
  requestedModel?: string;
  preferredKeyId?: string;
  workflowMode?: WorkflowSelection;
  reasoningEffort?: string;
  hasHeavyAttachments?: boolean;
  hasAnyAttachment?: boolean;
  preferredFailover?: boolean;
  signal?: AbortSignal;
  invoker?: OverviewerInvoker;
  onStatus?: (message: string) => void;
}): Promise<OverviewerDecision | null> {
  const startedAt = Date.now();
  const {
    pool,
    promptText,
    requestedModel,
    preferredKeyId,
    workflowMode = 'auto',
    reasoningEffort,
    hasHeavyAttachments,
    preferredFailover = true,
    signal,
    invoker = defaultOverviewerInvoker,
    onStatus,
  } = params;

  if (pool.length === 0) return null;

  const isManualModel = Boolean(requestedModel && requestedModel !== 'auto' && requestedModel !== 'default');
  const keywordMatch = detectKeywordTrigger({
    promptText,
    hasHeavyAttachments,
    workflowMode,
    reasoningEffort,
  });
  let taskType: RoutingTaskType = keywordMatch?.taskType || 'fast-chat';

  // Manual model override
  if (isManualModel) {
    const manualMatch =
      pool.find(c => c.modelId === requestedModel && (!preferredKeyId || c.keyId === preferredKeyId)) ||
      pool.find(c => c.modelId === requestedModel);

    if (manualMatch) {
      const backups = preferredFailover
        ? [...pool]
            .filter(c => !(c.keyId === manualMatch.keyId && c.modelId === manualMatch.modelId))
            .sort((a, b) => scoreCandidateForTask(b, taskType) - scoreCandidateForTask(a, taskType))
        : [];
      const candidates = [manualMatch, ...backups];
      return {
        taskType,
        category: manualMatch.category,
        triggeredByKeyword: false,
        selected: manualMatch,
        candidates,
        overviewerReplaced: [],
        decisionMs: Date.now() - startedAt,
        usedHeuristic: true,
        reason: `Manual model "${manualMatch.modelId}" selected`,
      };
    }
  }

  // No trigger keyword: run directly on the single fastest base model (zero Overviewer latency/overhead)
  if (!keywordMatch) {
    const defaultOrdered = [...pool].sort((a, b) => {
      if (preferredKeyId) {
        const aPref = a.keyId === preferredKeyId ? 1 : 0;
        const bPref = b.keyId === preferredKeyId ? 1 : 0;
        if (aPref !== bPref) return bPref - aPref;
      }
      return b.speedScore - a.speedScore;
    });
    const finalCandidates = preferredFailover ? defaultOrdered : [defaultOrdered[0]];
    return {
      taskType: 'fast-chat',
      category: 'turbo',
      triggeredByKeyword: false,
      selected: finalCandidates[0],
      candidates: finalCandidates,
      overviewerReplaced: [],
      decisionMs: Date.now() - startedAt,
      usedHeuristic: true,
      reason: `No trigger keyword — running base fast model "${finalCandidates[0].modelId}"`,
    };
  }

  // Trigger keyword detected -> run the Overviewer model to select workflow model
  const overviewerChain = getOverviewerCandidates(pool);
  const overviewerReplaced: Array<{ modelId: string; providerId: string; reason: string }> = [];
  let overviewerUsed: OverviewerDecision['overviewerUsed'];
  let overviewerPick: RoutedCandidate | undefined;
  let usedHeuristic = true;
  let reason = `Keyword "${keywordMatch.keyword}" triggered ${taskType}`;

  const shouldInvokeOverviewer =
    workflowMode === 'auto' &&
    overviewerChain.length > 0 &&
    pool.length > 1 &&
    !signal?.aborted;

  if (shouldInvokeOverviewer) {
    const slate = buildCompactSlateForOverviewer(pool);
    if (slate.length > 0) {
      const slateSummary = slate
        .map((c, idx) => `${idx}:${c.modelId}[${mapTaskTypeToCategory(classifyTaskForSummary(c))}]`)
        .join(' ');

      const ovSystem =
        'You are the EXCO Overviewer Router. Reply ONLY with JSON {"t":"research"|"docs"|"code"|"fast","i":<index>}. ' +
        'Choose which workflow & model index best fits the triggered request.';
      const snippet = (promptText || '').trim().slice(0, 360);
      const ovUser = `Trigger: ${keywordMatch.keyword}\nModels: ${slateSummary}\nTask: ${snippet}`;

      for (let attempt = 0; attempt < Math.min(2, overviewerChain.length); attempt++) {
        if (signal?.aborted) break;
        const ovCandidate = overviewerChain[attempt];
        onStatus?.(`Overviewer (${ovCandidate.modelId}) classifying "${keywordMatch.keyword}"...`);
        const linked = createLinkedSignal(signal, OVERVIEWER_TIMEOUT_MS);
        try {
          const reply = await invoker({
            candidate: ovCandidate,
            systemPrompt: ovSystem,
            userPrompt: ovUser,
            signal: linked.signal,
          });
          linked.cleanup();

          activeOverviewerKey = modelKey(ovCandidate.keyId, ovCandidate.modelId);
          overviewerUsed = {
            keyId: ovCandidate.keyId,
            keyName: ovCandidate.keyName,
            providerId: ovCandidate.providerId,
            modelId: ovCandidate.modelId,
          };

          const parsed = parseOverviewerReply(reply, slate.length);
          if (parsed?.taskType) {
            taskType = parsed.taskType;
            usedHeuristic = false;
            reason = `Overviewer (${ovCandidate.modelId}) selected ${taskType} for trigger "${keywordMatch.keyword}"`;
          }
          if (parsed?.candidateIndex !== undefined) {
            overviewerPick = slate[parsed.candidateIndex];
          }
          break;
        } catch (err: any) {
          linked.cleanup();
          if (signal?.aborted) break;
          if (linked.didTimeout()) {
            overviewerUsed = {
              keyId: ovCandidate.keyId,
              keyName: ovCandidate.keyName,
              providerId: ovCandidate.providerId,
              modelId: ovCandidate.modelId,
            };
            reason = `Keyword trigger "${keywordMatch.keyword}" -> ${taskType} (${OVERVIEWER_TIMEOUT_MS}ms Overviewer cap)`;
            break;
          }
          const errText = err instanceof Error ? err.message : String(err || 'error');
          if (isQuotaOrModelUnavailableError(err)) {
            markModelExhausted(ovCandidate.keyId, ovCandidate.modelId, errText);
            overviewerReplaced.push({
              modelId: ovCandidate.modelId,
              providerId: ovCandidate.providerId,
              reason: errText,
            });
            if (overviewerChain[attempt + 1]) {
              onStatus?.(`Overviewer limit on ${ovCandidate.modelId} — switching to ${overviewerChain[attempt + 1].modelId}...`);
            }
            continue;
          }
          break;
        }
      }
    }
  }

  const ranked = [...pool].sort((a, b) => {
    const scoreDiff = scoreCandidateForTask(b, taskType) - scoreCandidateForTask(a, taskType);
    if (scoreDiff !== 0) return scoreDiff;
    if (preferredKeyId) {
      const aPref = a.keyId === preferredKeyId ? 1 : 0;
      const bPref = b.keyId === preferredKeyId ? 1 : 0;
      if (aPref !== bPref) return bPref - aPref;
    }
    return b.speedScore - a.speedScore;
  });

  let ordered = ranked;
  if (overviewerPick && ranked.length > 0) {
    const bestScore = scoreCandidateForTask(ranked[0], taskType);
    const pickScore = scoreCandidateForTask(overviewerPick, taskType);
    if (pickScore >= bestScore - 15) {
      ordered = [
        overviewerPick,
        ...ranked.filter(c => !(c.keyId === overviewerPick!.keyId && c.modelId === overviewerPick!.modelId)),
      ];
    }
  }

  const finalCandidates = preferredFailover ? ordered : [ordered[0]];
  return {
    taskType,
    category: mapTaskTypeToCategory(taskType),
    triggeredByKeyword: true,
    triggerKeyword: keywordMatch.keyword,
    selected: finalCandidates[0],
    candidates: finalCandidates,
    overviewerUsed,
    overviewerReplaced,
    decisionMs: Date.now() - startedAt,
    usedHeuristic,
    reason,
  };
}
