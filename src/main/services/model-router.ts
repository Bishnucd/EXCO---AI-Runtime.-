/**
 * EXCO Overview-Scored Category Model Router
 *
 * - Strictly honors the user's manually selected workflow category ('turbo' | 'standard' | 'deep-thought').
 * - Zero prompt-keyword auto-switching between categories.
 * - Uses the unified 0-100 Overview benchmark scores to rank models within the selected category.
 * - When a model's token/quota limit runs out on one API key, automatically fails over to the
 *   SAME model on other configured API keys first before moving to the next-best model in category.
 */

import {
  computeModelBenchmarks,
  inferModelTier,
  inferProviderFromApiKey,
  resolveApiKeyProfile,
  scoreModelForWorkflowCategory,
  type ModelCategory,
  type WorkflowSelection,
} from '@shared/utils';
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
  overallScore: number;
  turboScore: number;
  standardScore: number;
  deepThoughtScore: number;
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
const DISCOVERY_TIMEOUT_MS = 1100;
const CANDIDATE_POOL_TTL_MS = 60 * 1000;

const exhaustedUntil = new Map<string, { until: number; reason: string }>();
const exhaustedKeysUntil = new Map<string, { until: number; reason: string }>();
let cachedPoolEntry: { keysSig: string; fetchedAt: number; candidates: RoutedCandidate[] } | null = null;
let inFlightPoolPromise: Promise<RoutedCandidate[]> | null = null;

function modelKey(keyId: string, modelId: string): string {
  return `${keyId}::${modelId}`;
}

export function invalidateCandidatePoolCache(): void {
  cachedPoolEntry = null;
}

export function clearRouterStateForTests(): void {
  exhaustedUntil.clear();
  exhaustedKeysUntil.clear();
  cachedPoolEntry = null;
  inFlightPoolPromise = null;
}

export function isAuthError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err || '')).toLowerCase();
  return (
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('unauthorized') ||
    msg.includes('unauthenticated') ||
    msg.includes('invalid api key') ||
    msg.includes('invalid_api_key') ||
    msg.includes('incorrect api key') ||
    msg.includes('invalid x-api-key') ||
    msg.includes('authentication') ||
    msg.includes('permission denied') ||
    msg.includes('forbidden')
  );
}

export function markKeyAuthFailed(keyId: string, reason = 'unauthorized'): void {
  if (!keyId) return;
  exhaustedKeysUntil.set(keyId, { until: Date.now() + EXHAUSTED_COOLDOWN_MS, reason });
}

export function markModelExhausted(keyId: string, modelId: string, reason = 'quota'): void {
  if (!modelId) return;
  const k = modelKey(keyId || 'default', modelId);
  exhaustedUntil.set(k, { until: Date.now() + EXHAUSTED_COOLDOWN_MS, reason });
  if (isAuthError(reason)) {
    markKeyAuthFailed(keyId || 'default', reason);
  }
}

export function isModelExhausted(keyId: string, modelId: string): boolean {
  const kid = keyId || 'default';
  const keyEntry = exhaustedKeysUntil.get(kid);
  if (keyEntry) {
    if (Date.now() > keyEntry.until) {
      exhaustedKeysUntil.delete(kid);
    } else {
      return true;
    }
  }
  const k = modelKey(kid, modelId);
  const entry = exhaustedUntil.get(k);
  if (!entry) return false;
  if (Date.now() > entry.until) {
    exhaustedUntil.delete(k);
    return false;
  }
  return true;
}

export function isQuotaOrModelUnavailableError(err: unknown): boolean {
  if (isAuthError(err)) return true;
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
  return /(embed|embedqa|nv-embed|bge-|e5-|rerank|nemoretriever|arctic-embed|tts|whisper|transcribe|imagen|veo|dall-e|flux|stable-diffusion|moderation|guard|shield|nemoguard|safety|topic-control|content-safety|parse|ocr|deplot|kosmos|audio|speech|realtime|live|robotics|computer-use|deep-research|gliner|pii|detector|synthetic-video|cosmos-|nvclip|riva-translate|ising-|calibration|starcoder2)/.test(
    text
  );
}

/**
 * Classifies models into strict reputation tiers so leading flagship models are ALWAYS chosen first,
 * secondary known models second, and obscure/unknown engines ONLY when all leading options are exhausted.
 */
export type ModelQualityTier = 1 | 2 | 3;

export function getModelQualityTier(modelId: string, modelName = ''): ModelQualityTier {
  const text = `${modelId} ${modelName}`.toLowerCase();
  if (/\b(allam|saba|palmyra|aion-rp|granite-?3b|gemma-2b)\b/.test(text)) {
    return 3;
  }
  // Tier 1: Industry-leading frontier & flagship conversational engines
  const isLeading =
    /\b(gemini-3(\.\d+)?|gemini-2\.5-flash(-lite)?|gemini-2\.5-pro|gemini-2\.0-flash)\b/.test(text) ||
    /\b(gpt-5(\.\d+)?|gpt-4\.1|gpt-4o|chatgpt-4o|o3|o4-mini)\b/.test(text) ||
    /\b(claude-(opus|sonnet|haiku)-4(\.\d+)?|claude-3[._-][57]-(sonnet|haiku)|claude-3\.5|claude-3\.7)\b/.test(text) ||
    /\b(llama-3\.3-70b|llama-4-maverick|llama-4-scout|llama-3\.1-70b|llama-3\.1-8b-instant)\b/.test(text) ||
    /\b(deepseek-chat|deepseek-v3(\.\d+)?|deepseek-r1|qwen-?2\.5-72b|qwen3-?(235b|32b|30b)|mistral-large|grok-[234])\b/.test(text);
  if (isLeading) return 1;

  // Tier 2: Secondary known solid families
  const isSecondary =
    /\b(gemini-1\.5|gemma-3|mistral-small|codestral|qwen-?2\.5|qwen3|llama-3\.2|phi-4|command-a|command-r|gpt-3\.5-turbo|claude-3-(haiku|sonnet))\b/.test(
      text
    );
  if (isSecondary) return 2;

  // Tier 3: Unknown, obscure, proxy aliases, or niche community fine-tunes
  return 3;
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
  const qualityTier = getModelQualityTier(params.modelId, params.modelName || '');

  // Strict tier separation: Leading models (200+) ALWAYS outrank Secondary (80+) and Obscure (0+)
  let score = qualityTier === 1 ? 220 : qualityTier === 2 ? 100 : 20;

  const isUltraFastGateway =
    base.includes('groq.com') || base.includes('cerebras') || base.includes('sambanova');

  if (base.includes('groq.com')) score += 28;
  else if (base.includes('cerebras')) score += 30;
  else if (base.includes('sambanova')) score += 24;
  else if (params.providerId === 'google') score += 22;
  else if (params.providerId === 'openai') score += 18;
  else if (params.providerId === 'anthropic') score += 16;
  else if (base.includes('nvidia.com')) score += 10;

  // Prioritize flagship fast conversational engines
  if (/\b(gemini-2\.5-flash|gemini-2\.0-flash|gemini-3(\.\d+)?-flash)\b/.test(text) && !text.includes('lite')) {
    score += 22;
  } else if (/\b(llama-3\.3-70b|llama-4-scout|llama-4-maverick|gpt-4o-mini|gpt-4\.1-mini|claude-3[._-]5-haiku|claude-haiku)\b/.test(text)) {
    score += 20;
  }

  if (/flash-lite|8b-instant|instant/.test(text)) score += 18;
  else if (/\b(flash|nano|mini|haiku|lite|8b|7b|4b|3b|2b|1b|small|fast|turbo|speed)\b/.test(text)) score += 14;
  else if (/\b(nemotron-mini|gemma-2-9b|gemma-3-4b|gemma-3-12b|phi-3|phi-4-mini|qwen-?2\.5-7b)\b/.test(text)) score += 12;

  if (/\b(70b|72b|32b|sonnet|gpt-4o)\b/.test(text) && !text.includes('mini') && !isUltraFastGateway) score -= 8;
  if (/\b(opus|o1|o3|o4|r1|qwq|reasoner|thinking|ultra|405b|671b|235b|480b)\b/.test(text)) score -= 24;
  if (/[-_/]pro\b/.test(text) && !text.includes('flash')) score -= 14;
  if (params.category === 'turbo') score += 10;
  if (params.category === 'deep-thought') score -= 14;
  if (params.modelId === 'auto') score -= 40;

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
  const qualityTier = getModelQualityTier(params.modelId, params.modelName || '');
  const tierOffset = qualityTier === 1 ? 180 : qualityTier === 2 ? 70 : 0;

  let researchScore = 40 + tierOffset + ctxBonus;
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

  let documentationScore = 45 + tierOffset + ctxBonus;
  if (/\b(claude|sonnet|gpt-4o|gemini-2\.5-pro|gemini-2\.5-flash|llama-3\.3-70b|qwen-2\.5-72b|mistral-large|command-r)\b/.test(text)) {
    documentationScore += 28;
  }
  if (params.category === 'standard') documentationScore += 14;
  if (params.category === 'deep-thought') documentationScore += 10;
  if (/\b(8b|7b|4b|3b|1b|nano)\b/.test(text)) documentationScore -= 14;
  if (/\b(r1|qwq|o1|o3)\b/.test(text)) documentationScore -= 6;

  let codingScore = 45 + tierOffset + Math.floor(ctxBonus * 0.6);
  if (/\b(coder|codestral|codellama|starcoder|deepseek-v3|deepseek-r1|sonnet|claude-3\.5|claude-sonnet|gpt-4o|o3-mini|qwen-2\.5-coder|llama-3\.3-70b|gemini-2\.5-pro)\b/.test(text)) {
    codingScore += 30;
  }
  if (params.category === 'deep-thought') codingScore += 12;
  if (params.category === 'standard') codingScore += 8;
  if (/\b(3b|2b|1b|nano)\b/.test(text)) codingScore -= 20;

  return { speedScore, researchScore, documentationScore, codingScore };
}

export function mapCategoryToTaskType(category: ModelCategory): RoutingTaskType {
  switch (category) {
    case 'deep-thought':
      return 'higher-research';
    case 'standard':
      return 'documentation';
    case 'turbo':
    default:
      return 'fast-chat';
  }
}

export function getCandidateCategoryScore(candidate: RoutedCandidate, category: ModelCategory): number {
  switch (category) {
    case 'turbo':
      return candidate.turboScore;
    case 'deep-thought':
      return candidate.deepThoughtScore;
    case 'standard':
    default:
      return candidate.standardScore;
  }
}

/**
 * Orders candidates strictly by best model first (Quality Tier -> Overview category score -> overall score),
 * keeping ALL non-exhausted API keys for the SAME modelId grouped consecutively (preferredKeyId first)
 * so quota exhaustion automatically switches to the same model on another API key before falling back.
 */
export function orderCandidatesByCategoryAndSameModelFailover(
  list: RoutedCandidate[],
  category: ModelCategory,
  preferredKeyId?: string
): RoutedCandidate[] {
  const groups = new Map<string, RoutedCandidate[]>();
  for (const c of list) {
    const arr = groups.get(c.modelId) || [];
    arr.push(c);
    groups.set(c.modelId, arr);
  }

  const rankedGroups = Array.from(groups.entries()).sort(([, aList], [, bList]) => {
    const aRep = aList[0];
    const bRep = bList[0];
    const tierDiff = getModelQualityTier(aRep.modelId, aRep.modelName) - getModelQualityTier(bRep.modelId, bRep.modelName);
    if (tierDiff !== 0) return tierDiff;
    const catScoreDiff = getCandidateCategoryScore(bRep, category) - getCandidateCategoryScore(aRep, category);
    if (catScoreDiff !== 0) return catScoreDiff;
    const overallDiff = bRep.overallScore - aRep.overallScore;
    if (overallDiff !== 0) return overallDiff;
    return bRep.speedScore - aRep.speedScore;
  });

  const ordered: RoutedCandidate[] = [];
  for (const [, keyCandidates] of rankedGroups) {
    keyCandidates.sort((a, b) => {
      if (preferredKeyId) {
        const aPref = a.keyId === preferredKeyId ? 1 : 0;
        const bPref = b.keyId === preferredKeyId ? 1 : 0;
        if (aPref !== bPref) return bPref - aPref;
      }
      return b.speedScore - a.speedScore;
    });
    ordered.push(...keyCandidates);
  }
  return ordered;
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
      const timer = setTimeout(() => controller.abort(), 900);
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
  const keysSig = allKeys.map(k => `${k.id}:${k.providerId}:${k.keyName}`).join('|') + `|env:${Boolean(process.env.GEMINI_API_KEY)}`;
  if (
    cachedPoolEntry &&
    cachedPoolEntry.keysSig === keysSig &&
    Date.now() - cachedPoolEntry.fetchedAt < CANDIDATE_POOL_TTL_MS &&
    cachedPoolEntry.candidates.length > 0
  ) {
    return cachedPoolEntry.candidates.filter(c => !isModelExhausted(c.keyId, c.modelId));
  }

  if (inFlightPoolPromise) {
    const shared = await inFlightPoolPromise;
    return shared.filter(c => !isModelExhausted(c.keyId, c.modelId));
  }

  const runDiscovery = async (): Promise<RoutedCandidate[]> => {
    const dbProviders = getProviders();
    const candidates: RoutedCandidate[] = [];
    const seenKeyModel = new Set<string>();

    const resolvedPairs = await Promise.all(
      allKeys.map(async kEntry => {
        const secret = await resolveKeySecret(kEntry).catch(() => null);
        return secret ? { entry: kEntry, secret } : null;
      })
    );
    const effectiveEntries = resolvedPairs.filter((x): x is { entry: ApiKeyEntry; secret: string } => Boolean(x));

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
        if ((profile.baseUrl || '').includes('elevenlabs.io')) return;
        const resolvedProviderId = inferProviderFromApiKey(secret, profile.providerId);
        const dbProv = findMatchingDbProvider(dbProviders, entry, profile);

        let rawModels: any[] = [];
        if (dbProv?.models && dbProv.models.length > 0) {
          rawModels = dbProv.models;
        } else {
          const isFreeLlm = secret.trim().startsWith('freellma');
          if (!isFreeLlm && (profile.baseUrl || resolvedProviderId !== 'custom')) {
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
          if (m?.isAvailable === false || m?.available === false) continue;
          if (isNonChatUtilityModel(mId, m?.name || '')) continue;

          const dedupeKey = modelKey(entry.id, mId);
          if (seenKeyModel.has(dedupeKey)) continue;
          seenKeyModel.add(dedupeKey);

          const resolvedTier = m?.tier || inferModelTier(m, profile, secret);
          if (resolvedTier === 'paid' && !keyAllowsPaid) continue;

          const bench = computeModelBenchmarks({
            id: mId,
            name: m?.name,
            providerId: resolvedProviderId,
            supportsReasoning: m?.supportsReasoning,
            supportsVision: m?.supportsVision,
            contextWindow: m?.contextWindow,
            capabilities: m?.capabilities,
            category: m?.category,
          });
          const category = bench.category;
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
            overallScore: bench.overallScore,
            turboScore: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'turbo'),
            standardScore: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'standard'),
            deepThoughtScore: scoreModelForWorkflowCategory(bench.scores, bench.overallScore, 'deep-thought'),
            contextWindow: m?.contextWindow || 32000,
            ...scores,
          });
        }
      })
    );

    if (candidates.length > 0) {
      cachedPoolEntry = { keysSig, fetchedAt: Date.now(), candidates };
    }
    return candidates;
  };

  inFlightPoolPromise = runDiscovery().finally(() => {
    inFlightPoolPromise = null;
  });
  const allCandidates = await inFlightPoolPromise;
  return allCandidates.filter(c => !isModelExhausted(c.keyId, c.modelId));
}

/**
 * Routes a turn strictly within the user's manually chosen workflow category ('turbo' | 'standard' | 'deep-thought'):
 * - Ranks models in that category by their Overview 0-100 score (best model first).
 * - Keeps all configured API keys for the SAME model consecutively so quota exhaustion switches
 *   to another API key with the same model before falling back to the next-best model.
 * - Pre-checks / re-evaluates from the #1 Overview model on every turn once cooldown expires.
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
  onStatus?: (message: string) => void;
}): Promise<OverviewerDecision | null> {
  const startedAt = Date.now();
  const {
    pool,
    requestedModel,
    preferredKeyId,
    workflowMode = 'standard',
    preferredFailover = true,
  } = params;

  if (pool.length === 0) return null;

  const activeCategory: ModelCategory =
    workflowMode === 'turbo' || workflowMode === 'standard' || workflowMode === 'deep-thought'
      ? workflowMode
      : 'standard';
  const taskType = mapCategoryToTaskType(activeCategory);

  const isManualModel = Boolean(
    requestedModel &&
      requestedModel !== 'auto' &&
      requestedModel !== 'default' &&
      requestedModel !== 'category-best'
  );

  // Manual model selection: try the selected model on preferredKeyId first, then the SAME model on any other API key
  if (isManualModel && requestedModel) {
    const sameModelMatches = pool
      .filter(c => c.modelId === requestedModel)
      .sort((a, b) => {
        if (preferredKeyId) {
          const aPref = a.keyId === preferredKeyId ? 1 : 0;
          const bPref = b.keyId === preferredKeyId ? 1 : 0;
          if (aPref !== bPref) return bPref - aPref;
        }
        return b.speedScore - a.speedScore;
      });

    if (sameModelMatches.length > 0) {
      const sameCategoryBackups = preferredFailover
        ? orderCandidatesByCategoryAndSameModelFailover(
            pool.filter(c => c.modelId !== requestedModel && c.category === activeCategory),
            activeCategory,
            preferredKeyId
          )
        : [];
      const otherCategoryBackups = preferredFailover
        ? orderCandidatesByCategoryAndSameModelFailover(
            pool.filter(c => c.modelId !== requestedModel && c.category !== activeCategory),
            activeCategory,
            preferredKeyId
          )
        : [];
      const candidates = [...sameModelMatches, ...sameCategoryBackups, ...otherCategoryBackups];
      return {
        taskType,
        category: sameModelMatches[0].category,
        triggeredByKeyword: false,
        selected: candidates[0],
        candidates,
        overviewerReplaced: [],
        decisionMs: Date.now() - startedAt,
        usedHeuristic: false,
        reason: `Manual model "${sameModelMatches[0].modelId}" selected`,
      };
    }
  }

  // Strictly select the highest Overview-scoring model under the chosen workflow category
  const inCategory = orderCandidatesByCategoryAndSameModelFailover(
    pool.filter(c => c.category === activeCategory),
    activeCategory,
    preferredKeyId
  );
  const outOfCategory = orderCandidatesByCategoryAndSameModelFailover(
    pool.filter(c => c.category !== activeCategory),
    activeCategory,
    preferredKeyId
  );

  const ordered =
    inCategory.length > 0
      ? preferredFailover
        ? [...inCategory, ...outOfCategory]
        : inCategory
      : outOfCategory;

  const finalCandidates = preferredFailover ? ordered : [ordered[0]];
  const winner = finalCandidates[0];
  const winnerScore = getCandidateCategoryScore(winner, activeCategory);

  return {
    taskType,
    category: activeCategory,
    triggeredByKeyword: false,
    selected: winner,
    candidates: finalCandidates,
    overviewerReplaced: [],
    decisionMs: Date.now() - startedAt,
    usedHeuristic: false,
    reason: `Overview #1 in ${activeCategory}: "${winner.modelId}" (${winnerScore}/100)`,
  };
}
