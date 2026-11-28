/**
 * EXCO Shared Utilities
 * Common utility functions used across the application
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ============================================================================
// Class Name Utilities
// ============================================================================

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================================
// ID Generation
// ============================================================================

export function generateId(): string {
  return uuidv4();
}

export function generateShortId(): string {
  return uuidv4().slice(0, 8);
}

// ============================================================================
// Date/Time Utilities
// ============================================================================

export function formatTimestamp(timestamp: number): string {
  return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function formatDateOnly(timestamp: number): string {
  return format(new Date(timestamp), 'yyyy-MM-dd');
}

export function formatTimeOnly(timestamp: number): string {
  return format(new Date(timestamp), 'HH:mm:ss');
}

export function parseTimestamp(dateString: string): number {
  return parseISO(dateString).getTime();
}

export function now(): number {
  return Date.now();
}

// ============================================================================
// File Utilities
// ============================================================================

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) return '';
  return filename.slice(lastDot + 1).toLowerCase();
}

export function getFileNameWithoutExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return filename;
  return filename.slice(0, lastDot);
}

export function isBinaryFile(filename: string): boolean {
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
  return binaryExtensions.has(getFileExtension(filename));
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const mimeTypes: Record<string, string> = {
    // Text
    txt: 'text/plain',
    md: 'text/markdown',
    json: 'application/json',
    js: 'application/javascript',
    ts: 'application/typescript',
    jsx: 'application/javascript',
    tsx: 'application/typescript',
    html: 'text/html',
    css: 'text/css',
    xml: 'application/xml',
    yaml: 'application/yaml',
    yml: 'application/yaml',
    csv: 'text/csv',
    // Code
    py: 'text/x-python',
    rs: 'text/x-rust',
    go: 'text/x-go',
    java: 'text/x-java',
    cpp: 'text/x-c++',
    c: 'text/x-c',
    h: 'text/x-c',
    cs: 'text/x-csharp',
    php: 'text/x-php',
    rb: 'text/x-ruby',
    swift: 'text/x-swift',
    kt: 'text/x-kotlin',
    // Images
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    // Fonts
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    // Archives
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    // Documents
    pdf: 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ============================================================================
// Path Utilities
// ============================================================================

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

export function joinPath(...parts: string[]): string {
  return normalizePath(parts.filter(Boolean).join('/'));
}

export function getParentPath(path: string): string {
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash <= 0) return '/';
  return normalized.slice(0, lastSlash);
}

export function getPathParts(path: string): string[] {
  return normalizePath(path).split('/').filter(Boolean);
}

function canonicalizePosixPath(input: string): string {
  const norm = normalizePath(input).replace(/\/$/, '');
  const driveMatch = norm.match(/^([a-zA-Z]:)(\/.*)?$/);
  const prefix = driveMatch ? driveMatch[1].toLowerCase() : norm.startsWith('/') ? '/' : '';
  const body = driveMatch ? (driveMatch[2] || '') : norm;
  const parts = body.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop();
      } else if (!prefix) {
        stack.push('..');
      }
    } else {
      stack.push(part);
    }
  }
  return prefix === '/' ? '/' + stack.join('/') : prefix ? `${prefix}/${stack.join('/')}` : stack.join('/');
}

export function isPathWithin(root: string, target: string): boolean {
  let cmpRoot = canonicalizePosixPath(root);
  let cmpTarget = canonicalizePosixPath(target);
  if (!cmpRoot || !cmpTarget) return false;
  if (/^[a-z]:\//i.test(cmpRoot) || /^[a-z]:\//i.test(cmpTarget)) {
    cmpRoot = cmpRoot.toLowerCase();
    cmpTarget = cmpTarget.toLowerCase();
  }
  return cmpTarget === cmpRoot || cmpTarget.startsWith(cmpRoot + '/');
}

export function resolveRelativePath(from: string, to: string): string {
  const fromParts = getPathParts(from);
  const toParts = getPathParts(to);

  let commonLength = 0;
  while (commonLength < fromParts.length && commonLength < toParts.length && fromParts[commonLength] === toParts[commonLength]) {
    commonLength++;
  }

  const upCount = fromParts.length - commonLength;
  const upPath = '../'.repeat(upCount);
  const downPath = toParts.slice(commonLength).join('/');

  return joinPath(upPath, downPath) || '.';
}

// ============================================================================
// String Utilities
// ============================================================================

export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function escapeHtml(str: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, char => entities[char] || char);
}

export function unescapeHtml(str: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return str.replace(/&(amp|lt|gt|quot|#39);/g, match => entities[match] || match);
}

// ============================================================================
// Array/Object Utilities
// ============================================================================

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function uniqueBy<T>(array: T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
    } else if (sourceValue !== undefined) {
      (result as Record<string, unknown>)[key] = sourceValue;
    }
  }
  return result;
}

// ============================================================================
// Async Utilities
// ============================================================================

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number; backoff?: number } = { retries: 3, delay: 1000 }
): Promise<T> {
  return fn().catch(err => {
    if (options.retries <= 0) throw err;
    return sleep(options.delay).then(() =>
      retry(fn, {
        retries: options.retries - 1,
        delay: options.backoff ? options.delay * options.backoff : options.delay,
        backoff: options.backoff,
      })
    );
  });
}

export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// Error Utilities
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

// ============================================================================
// Crypto Utilities (for non-sensitive operations)
// ============================================================================

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ============================================================================
// Environment Utilities
// ============================================================================

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

export function getPlatform(): NodeJS.Platform {
  return process.platform;
}

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function isMac(): boolean {
  return process.platform === 'darwin';
}

export function isLinux(): boolean {
  return process.platform === 'linux';
}

export function getDefaultShell(): string {
  if (isWindows()) return 'powershell.exe';
  if (isMac()) return '/bin/zsh';
  return '/bin/bash';
}

// ============================================================================
// URL/Link Utilities
// ============================================================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// ============================================================================
// Number Utilities
// ============================================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// AI Provider & Model Workflow Utilities
// ============================================================================

export type ModelCategory = 'turbo' | 'standard' | 'deep-thought';
export type WorkflowSelection = 'auto' | ModelCategory;

export interface WorkflowCategoryInfo {
  id: ModelCategory;
  label: string;
  shortDesc: string;
  detail: string;
}

export const AUTO_WORKFLOW_INFO = {
  id: 'auto' as const,
  label: 'Auto',
  shortDesc: 'Automatic Turbo / Standard / Deep Thought',
  detail: 'Automatically selects Turbo for quick prompts, Standard for everyday tasks, or Deep Thought for complex coding, reasoning, or attached files.',
};

export const WORKFLOW_CATEGORIES: WorkflowCategoryInfo[] = [
  {
    id: 'turbo',
    label: 'Turbo',
    shortDesc: 'Maximum speed & instant answers',
    detail: 'Routes to fast, lightweight models (Flash, Mini, Haiku, Nano) for quick chat, summaries, and low-latency tasks.',
  },
  {
    id: 'standard',
    label: 'Standard',
    shortDesc: 'Balanced quality & everyday coding',
    detail: 'Routes to versatile general-purpose models for writing, everyday Q&A, analysis, and multi-step tasks.',
  },
  {
    id: 'deep-thought',
    label: 'Deep Thought',
    shortDesc: 'Extended reasoning & complex work',
    detail: 'Routes to high-capacity reasoning models (Pro, Opus, Sonnet 4, o1/o3/R1) for architecture, debugging, and hard problems.',
  },
];

export function classifyModelCategory(model: {
  id?: string;
  name?: string;
  supportsReasoning?: boolean;
  category?: ModelCategory;
}): ModelCategory {
  if (model.category) return model.category;
  const text = `${model.id || ''} ${model.name || ''}`.toLowerCase();

  // Check lightweight/speed models first so names like "flash-thinking" or "o3-mini" still resolve cleanly:
  // explicit reasoning/deep models win if they are frontier reasoning tiers unless marked mini/flash/lite/haiku/nano
  const isLightweight = /\b(flash|mini|haiku|nano|instant|lite|fast|8b|7b|4b|3b|1b|small|speed)\b/.test(text);
  const isDeepReasoning =
    Boolean(model.supportsReasoning) ||
    /\b(opus|o1|o3|o4|r1|qwq|reasoner|thinking|deep|sonnet[-_ ]?4|sonnet[-_ ]?3[._-]7|gemini[-_ ]?(2\.5|3(\.\d+)?)[-_ ]?pro|1\.5[-_ ]?pro|405b)\b/.test(text) ||
    /[-_/]pro$/.test(text.trim());

  if (isDeepReasoning && !text.includes('mini') && !text.includes('flash') && !text.includes('lite')) {
    return 'deep-thought';
  }
  if (isLightweight) {
    return 'turbo';
  }
  if (isDeepReasoning) {
    return 'deep-thought';
  }
  return 'standard';
}

export function getProviderDisplayName(providerId?: string): string {
  switch ((providerId || '').toLowerCase()) {
    case 'google':
      return 'Google Gemini';
    case 'anthropic':
      return 'Anthropic';
    case 'openai':
      return 'OpenAI';
    case 'openrouter':
      return 'OpenRouter';
    case 'ollama':
      return 'Ollama';
    case 'custom':
      return 'Custom Gateway';
    case 'auto':
      return 'Auto Router';
    default:
      return providerId ? capitalize(providerId) : 'Unknown Provider';
  }
}

// ============================================================================
// Export all utilities as a namespace for convenience
// ============================================================================

export interface ApiKeyProfile {
  providerId: 'google' | 'anthropic' | 'openrouter' | 'openai' | 'ollama' | 'custom';
  displayName: string;
  baseUrl: string;
  defaultModel?: string;
  tier: 'free' | 'paid';
}

const API_KEY_PREFIX_PROFILES: Array<{ prefix: string; profile: ApiKeyProfile }> = [
  {
    prefix: 'nvapi-',
    profile: {
      providerId: 'custom',
      displayName: 'NVIDIA NIM',
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      defaultModel: 'meta/llama-3.1-70b-instruct',
      tier: 'free',
    },
  },
  {
    prefix: 'freellma',
    profile: {
      providerId: 'custom',
      displayName: 'FreeLLMAPI Gateway',
      baseUrl: 'http://127.0.0.1:31415/v1',
      defaultModel: 'auto',
      tier: 'free',
    },
  },
  {
    prefix: 'sk-or-',
    profile: {
      providerId: 'openrouter',
      displayName: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api',
      tier: 'paid',
    },
  },
  {
    prefix: 'AIza',
    profile: {
      providerId: 'google',
      displayName: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      defaultModel: 'gemini-2.5-flash',
      tier: 'free',
    },
  },
  {
    prefix: 'sk-ant-',
    profile: {
      providerId: 'anthropic',
      displayName: 'Anthropic Claude',
      baseUrl: 'https://api.anthropic.com',
      tier: 'paid',
    },
  },
  {
    prefix: 'gsk_',
    profile: {
      providerId: 'custom',
      displayName: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      defaultModel: 'llama-3.3-70b-versatile',
      tier: 'free',
    },
  },
  {
    prefix: 'hf_',
    profile: {
      providerId: 'custom',
      displayName: 'Hugging Face Router',
      baseUrl: 'https://router.huggingface.co/v1',
      tier: 'free',
    },
  },
  {
    prefix: 'pplx-',
    profile: {
      providerId: 'custom',
      displayName: 'Perplexity',
      baseUrl: 'https://api.perplexity.ai',
      defaultModel: 'sonar-pro',
      tier: 'paid',
    },
  },
  {
    prefix: 'xai-',
    profile: {
      providerId: 'custom',
      displayName: 'xAI Grok',
      baseUrl: 'https://api.x.ai/v1',
      defaultModel: 'grok-2-latest',
      tier: 'paid',
    },
  },
  {
    prefix: 'csk-',
    profile: {
      providerId: 'custom',
      displayName: 'Cerebras',
      baseUrl: 'https://api.cerebras.ai/v1',
      defaultModel: 'llama-3.3-70b',
      tier: 'free',
    },
  },
  {
    prefix: 'tgp_v1_',
    profile: {
      providerId: 'custom',
      displayName: 'Together AI',
      baseUrl: 'https://api.together.xyz/v1',
      tier: 'paid',
    },
  },
  {
    prefix: 'fw_',
    profile: {
      providerId: 'custom',
      displayName: 'Fireworks AI',
      baseUrl: 'https://api.fireworks.ai/inference/v1',
      tier: 'paid',
    },
  },
  {
    prefix: 'r8_',
    profile: {
      providerId: 'custom',
      displayName: 'Replicate',
      baseUrl: 'https://openai-proxy.replicate.com/v1',
      tier: 'paid',
    },
  },
  {
    prefix: 'sk-proj-',
    profile: {
      providerId: 'openai',
      displayName: 'OpenAI',
      baseUrl: 'https://api.openai.com',
      tier: 'paid',
    },
  },
  {
    prefix: 'sk-svcacct-',
    profile: {
      providerId: 'openai',
      displayName: 'OpenAI',
      baseUrl: 'https://api.openai.com',
      tier: 'paid',
    },
  },
  {
    prefix: 'sk-',
    profile: {
      providerId: 'openai',
      displayName: 'OpenAI',
      baseUrl: 'https://api.openai.com',
      tier: 'paid',
    },
  },
];

const HINT_PROFILES: Array<{ keywords: string[]; profile: ApiKeyProfile }> = [
  {
    keywords: ['nvidia', 'nim'],
    profile: API_KEY_PREFIX_PROFILES[0].profile,
  },
  {
    keywords: ['freellm'],
    profile: API_KEY_PREFIX_PROFILES[1].profile,
  },
  {
    keywords: ['gemini', 'google'],
    profile: API_KEY_PREFIX_PROFILES[3].profile,
  },
  {
    keywords: ['claude', 'anthropic'],
    profile: API_KEY_PREFIX_PROFILES[4].profile,
  },
  {
    keywords: ['openrouter'],
    profile: API_KEY_PREFIX_PROFILES[2].profile,
  },
  {
    keywords: ['groq'],
    profile: API_KEY_PREFIX_PROFILES[5].profile,
  },
  {
    keywords: ['hugging', 'huggingface'],
    profile: API_KEY_PREFIX_PROFILES[6].profile,
  },
  {
    keywords: ['perplexity', 'pplx'],
    profile: API_KEY_PREFIX_PROFILES[7].profile,
  },
  {
    keywords: ['xai', 'grok'],
    profile: API_KEY_PREFIX_PROFILES[8].profile,
  },
  {
    keywords: ['cerebras'],
    profile: API_KEY_PREFIX_PROFILES[9].profile,
  },
  {
    keywords: ['together'],
    profile: API_KEY_PREFIX_PROFILES[10].profile,
  },
  {
    keywords: ['fireworks'],
    profile: API_KEY_PREFIX_PROFILES[11].profile,
  },
  {
    keywords: ['deepseek'],
    profile: { providerId: 'custom', displayName: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', defaultModel: 'deepseek-chat', tier: 'paid' },
  },
  {
    keywords: ['mistral'],
    profile: { providerId: 'custom', displayName: 'Mistral AI', baseUrl: 'https://api.mistral.ai/v1', defaultModel: 'mistral-small-latest', tier: 'free' },
  },
  {
    keywords: ['qwen', 'dashscope', 'alibaba'],
    profile: { providerId: 'custom', displayName: 'Alibaba DashScope', baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1', tier: 'paid' },
  },
  {
    keywords: ['moonshot', 'kimi'],
    profile: { providerId: 'custom', displayName: 'Moonshot AI', baseUrl: 'https://api.moonshot.ai/v1', tier: 'paid' },
  },
  {
    keywords: ['z-ai', 'zai', 'zhipu', 'glm'],
    profile: { providerId: 'custom', displayName: 'Zhipu / Z-AI', baseUrl: 'https://api.z.ai/api/paas/v4', tier: 'free' },
  },
  {
    keywords: ['kilo', 'kilocode'],
    profile: { providerId: 'custom', displayName: 'Kilo Code Gateway', baseUrl: 'https://api.kilocode.ai/api/openrouter', tier: 'free' },
  },
  {
    keywords: ['cloudflare', 'workers'],
    profile: { providerId: 'custom', displayName: 'Cloudflare Workers AI', baseUrl: '', tier: 'free' },
  },
  {
    keywords: ['aion'],
    profile: { providerId: 'custom', displayName: 'Aion Labs', baseUrl: 'https://api.aionlabs.ai/v1', defaultModel: 'aion-labs/aion-3.5', tier: 'free' },
  },
  {
    keywords: ['parallel'],
    profile: { providerId: 'custom', displayName: 'Parallel AI', baseUrl: 'https://api.parallel.ai/v1', defaultModel: 'parallel', tier: 'free' },
  },
  {
    keywords: ['llm7'],
    profile: { providerId: 'custom', displayName: 'LLM7 Gateway', baseUrl: 'https://api.llm7.io/v1', defaultModel: 'default', tier: 'free' },
  },
  {
    keywords: ['cohere'],
    profile: { providerId: 'custom', displayName: 'Cohere', baseUrl: 'https://api.cohere.ai/compatibility/v1', tier: 'free' },
  },
  {
    keywords: ['sambanova'],
    profile: { providerId: 'custom', displayName: 'SambaNova', baseUrl: 'https://api.sambanova.ai/v1', tier: 'free' },
  },
  {
    keywords: ['nebius'],
    profile: { providerId: 'custom', displayName: 'Nebius AI', baseUrl: 'https://api.studio.nebius.com/v1', tier: 'paid' },
  },
  {
    keywords: ['hyperbolic'],
    profile: { providerId: 'custom', displayName: 'Hyperbolic', baseUrl: 'https://api.hyperbolic.xyz/v1', tier: 'paid' },
  },
  {
    keywords: ['novita'],
    profile: { providerId: 'custom', displayName: 'Novita AI', baseUrl: 'https://api.novita.ai/v3/openai', tier: 'paid' },
  },
  {
    keywords: ['ollama'],
    profile: { providerId: 'ollama', displayName: 'Ollama Local', baseUrl: 'http://localhost:11434', tier: 'free' },
  },
  {
    keywords: ['openai', 'chatgpt'],
    profile: { providerId: 'openai', displayName: 'OpenAI', baseUrl: 'https://api.openai.com', tier: 'paid' },
  },
];

export function inferModelTier(
  model: { id?: string; tier?: string; free?: boolean; pricing?: { prompt?: any; completion?: any } },
  profileOrProvider?: ApiKeyProfile | string,
  rawSecret?: string
): 'free' | 'paid' {
  const idLower = (model?.id || '').toLowerCase();
  if (model?.pricing) {
    const promptCost = Number(model.pricing.prompt ?? 0);
    const completionCost = Number(model.pricing.completion ?? 0);
    if (Number.isFinite(promptCost) && Number.isFinite(completionCost) && (promptCost > 0 || completionCost > 0)) {
      return 'paid';
    }
    if (promptCost === 0 && completionCost === 0) {
      return 'free';
    }
  }

  if (model?.free === true || model?.tier === 'free' || idLower.includes(':free')) {
    return 'free';
  }

  const secretLower = (rawSecret || '').trim().toLowerCase();
  const providerType = typeof profileOrProvider === 'string' ? profileOrProvider : profileOrProvider?.providerId;
  const displayLower = typeof profileOrProvider === 'string' ? '' : (profileOrProvider?.displayName || '').toLowerCase();

  if (
    providerType === 'ollama' ||
    secretLower.startsWith('freellma') ||
    secretLower.startsWith('nvapi-') ||
    secretLower.startsWith('gsk_') ||
    secretLower.startsWith('csk-') ||
    displayLower.includes('nvidia') ||
    displayLower.includes('groq') ||
    displayLower.includes('cerebras') ||
    displayLower.includes('freellm') ||
    displayLower.includes('mistral') ||
    displayLower.includes('sambanova') ||
    displayLower.includes('zhipu') ||
    displayLower.includes('z-ai') ||
    displayLower.includes('kilo') ||
    displayLower.includes('aion') ||
    displayLower.includes('parallel') ||
    displayLower.includes('cloudflare') ||
    displayLower.includes('llm7')
  ) {
    return 'free';
  }

  if (providerType === 'google') {
    if (
      idLower.includes('flash') ||
      idLower.includes('gemma') ||
      idLower.includes('nano') ||
      idLower.includes('2.0') ||
      idLower.includes('1.5')
    ) {
      return 'free';
    }
  }

  return model?.tier === 'free' ? 'free' : 'paid';
}

export function resolveApiKeyProfile(rawKey: string, requestedProvider?: string, keyNameHint?: string): ApiKeyProfile {
  const trimmed = (rawKey || '').trim();
  const hint = (keyNameHint || '').toLowerCase();

  // Check explicit URL embedded in keyName (e.g. "My Proxy https://my.api/v1")
  const embeddedUrlMatch = (keyNameHint || '').match(/https?:\/\/[^\s)]+/i);
  if (embeddedUrlMatch) {
    const cleanUrl = embeddedUrlMatch[0].replace(/\/+$/, '');
    return {
      providerId: 'custom',
      displayName: keyNameHint!.replace(embeddedUrlMatch[0], '').trim() || cleanUrl,
      baseUrl: cleanUrl,
      tier: 'paid',
    };
  }

  // Distinct provider prefixes take top precedence (AIza, nvapi-, sk-ant-, sk-or-, gsk_, csk-, hf_, etc.)
  const strictMatches = API_KEY_PREFIX_PROFILES.filter(
    item => !['sk-', 'sk-proj-', 'sk-svcacct-'].includes(item.prefix) && trimmed.startsWith(item.prefix)
  );
  if (strictMatches.length > 0) {
    return strictMatches[0].profile;
  }

  // Match key name hints next so sk- keys for DeepSeek, Mistral, Qwen, Moonshot, etc. don't misroute to OpenAI
  if (hint) {
    const matchedHint = HINT_PROFILES.find(entry => entry.keywords.some(kw => hint.includes(kw)));
    if (matchedHint) {
      return matchedHint.profile;
    }
  }

  // Ambiguous OpenAI-style sk- prefixes
  const openAiMatch = API_KEY_PREFIX_PROFILES.find(item => trimmed.startsWith(item.prefix));
  if (openAiMatch) {
    return openAiMatch.profile;
  }

  if (requestedProvider && requestedProvider !== 'auto' && requestedProvider !== 'default') {
    const byProvider: Record<string, ApiKeyProfile> = {
      google: { providerId: 'google', displayName: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', defaultModel: 'gemini-2.5-flash', tier: 'free' },
      anthropic: { providerId: 'anthropic', displayName: 'Anthropic Claude', baseUrl: 'https://api.anthropic.com', tier: 'paid' },
      openrouter: { providerId: 'openrouter', displayName: 'OpenRouter', baseUrl: 'https://openrouter.ai/api', tier: 'paid' },
      openai: { providerId: 'openai', displayName: 'OpenAI', baseUrl: 'https://api.openai.com', tier: 'paid' },
      ollama: { providerId: 'ollama', displayName: 'Ollama Local', baseUrl: 'http://localhost:11434', tier: 'free' },
    };
    if (byProvider[requestedProvider]) {
      return byProvider[requestedProvider];
    }
    return { providerId: requestedProvider as any, displayName: capitalize(requestedProvider), baseUrl: '', tier: 'paid' };
  }

  return {
    providerId: 'custom',
    displayName: 'Custom API',
    baseUrl: '',
    tier: 'paid',
  };
}

export function inferProviderFromApiKey(rawKey: string, requestedProvider?: string, keyNameHint?: string): string {
  const profile = resolveApiKeyProfile(rawKey, requestedProvider, keyNameHint);
  if (requestedProvider && requestedProvider !== 'auto' && requestedProvider !== 'default') {
    // Allow prefix/hint detection to repair older records saved under generic 'custom'
    if (requestedProvider === 'custom' && profile.providerId !== 'custom') {
      return profile.providerId;
    }
    return requestedProvider;
  }
  return profile.providerId;
}

export const utils = {
  inferModelTier,
  resolveApiKeyProfile,
  inferProviderFromApiKey,
  cn,
  generateId,
  generateShortId,
  formatTimestamp,
  formatRelativeTime,
  formatDateOnly,
  formatTimeOnly,
  parseTimestamp,
  now,
  getFileExtension,
  getFileNameWithoutExtension,
  isBinaryFile,
  getMimeType,
  formatFileSize,
  normalizePath,
  joinPath,
  getParentPath,
  getPathParts,
  isPathWithin,
  resolveRelativePath,
  truncate,
  capitalize,
  camelToKebab,
  kebabToCamel,
  slugify,
  escapeHtml,
  unescapeHtml,
  groupBy,
  uniqueBy,
  chunk,
  shuffle,
  deepClone,
  deepMerge,
  sleep,
  retry,
  timeout,
  debounce,
  throttle,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  isAppError,
  getErrorMessage,
  generateRandomString,
  hashString,
  isDevelopment,
  isProduction,
  isTest,
  getPlatform,
  isWindows,
  isMac,
  isLinux,
  isValidUrl,
  extractDomain,
  clamp,
  round,
  randomInt,
};

export * from './voiceSession';