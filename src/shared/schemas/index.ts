/**
 * EXCO Shared Schemas
 * Zod schemas for runtime validation of IPC messages and data
 */

import { z } from 'zod';

// ============================================================================
// Base Schemas
// ============================================================================

export const uuidSchema = z.string().uuid();

export const timestampSchema = z.number().int().positive();

export const nonEmptyStringSchema = z.string().min(1);

// ============================================================================
// Application Core Schemas
// ============================================================================

export const operatingModeSchema = z.enum(['chatbot', 'work']);

export const permissionLevelSchema = z.enum(['ask', 'selected-folder', 'full-access']);

export const themeModeSchema = z.enum(['light', 'dark', 'system']);

export const appConfigSchema = z.object({
  mode: operatingModeSchema,
  theme: themeModeSchema,
  permissionLevel: permissionLevelSchema,
  workspacePath: z.string().optional(),
  recentWorkspaces: z.array(z.string()).default([]),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

// ============================================================================
// Chatbot Schemas
// ============================================================================

export const messageRoleSchema = z.enum(['user', 'assistant', 'system', 'tool']);

export const messageStatusSchema = z.enum(['pending', 'streaming', 'complete', 'error']);

export const reasoningEffortSchema = z.enum(['low', 'medium', 'high']);

export const fileDataSchema = z.object({
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  base64: z.string(),
});

export const messageContentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('image'), imageUrl: z.string().url() }),
  z.object({ type: z.literal('file'), fileData: fileDataSchema }),
]);

export const toolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  arguments: z.record(z.unknown()),
});

export const tokenUsageSchema = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
});

export const messageSchema = z.object({
  id: uuidSchema,
  conversationId: uuidSchema,
  role: messageRoleSchema,
  content: z.union([z.string(), z.array(messageContentSchema)]),
  createdAt: timestampSchema,
  modelId: z.string().optional(),
  providerId: z.string().optional(),
  toolCalls: z.array(toolCallSchema).optional(),
  toolCallId: z.string().optional(),
  tokens: tokenUsageSchema.optional(),
  status: messageStatusSchema,
});

export const conversationSchema = z.object({
  id: uuidSchema,
  title: z.string().min(1).max(200),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  archivedAt: timestampSchema.optional(),
  modelId: z.string(),
  providerId: z.string(),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  reasoningEffort: reasoningEffortSchema.optional(),
});

export const createConversationInputSchema = conversationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  title: true,
  modelId: true,
  providerId: true,
});

export const updateConversationInputSchema = z.object({
  id: uuidSchema,
  updates: conversationSchema.partial().omit({ id: true, createdAt: true }),
});

// ============================================================================
// AI Provider Schemas
// ============================================================================

export const providerTypeSchema = z.enum(['anthropic', 'openai', 'google', 'ollama', 'openrouter', 'custom']);

export const providerConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().url().optional(),
  organization: z.string().optional(),
  customHeaders: z.record(z.string()).optional(),
});

export const modelCapabilitiesSchema = z.object({
  chat: z.boolean().default(true),
  completion: z.boolean().default(false),
  embedding: z.boolean().default(false),
  imageGeneration: z.boolean().default(false),
  audioTranscription: z.boolean().default(false),
});

export const modelPricingSchema = z.object({
  inputPerMillion: z.number().nonnegative(),
  outputPerMillion: z.number().nonnegative(),
  currency: z.literal('USD'),
});

export const aiModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  providerId: z.string(),
  capabilities: modelCapabilitiesSchema,
  contextWindow: z.number().int().positive(),
  maxOutputTokens: z.number().int().positive(),
  supportsStreaming: z.boolean().default(true),
  supportsTools: z.boolean().default(false),
  supportsVision: z.boolean().default(false),
  supportsReasoning: z.boolean().default(false),
  pricing: modelPricingSchema.optional(),
});

export const aiProviderSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  type: providerTypeSchema,
  config: providerConfigSchema,
  models: z.array(aiModelSchema).default([]),
  enabled: z.boolean().default(true),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createProviderInputSchema = aiProviderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProviderInputSchema = z.object({
  id: uuidSchema,
  updates: aiProviderSchema.partial().omit({ id: true, createdAt: true }),
});

// ============================================================================
// Work Mode Schemas
// ============================================================================

export const gitStatusSchema = z.enum(['unmodified', 'modified', 'added', 'deleted', 'renamed', 'untracked', 'ignored']);

export const fileSystemNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    path: z.string(),
    name: z.string(),
    type: z.enum(['file', 'directory', 'symlink']),
    size: z.number().int().nonnegative().optional(),
    modifiedAt: timestampSchema,
    createdAt: timestampSchema,
    extension: z.string().optional(),
    isBinary: z.boolean().optional(),
    gitStatus: gitStatusSchema.optional(),
    children: z.array(fileSystemNodeSchema).optional(),
  })
);

export const workspaceMetadataSchema = z.object({
  projectType: z.string().optional(),
  framework: z.string().optional(),
  language: z.string().optional(),
  gitRepository: z.boolean().optional(),
  excoFolder: z.boolean().optional(),
});

export const workspaceSchema = z.object({
  id: uuidSchema,
  path: z.string(),
  name: z.string(),
  permissionLevel: permissionLevelSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  metadata: workspaceMetadataSchema,
});

export const terminalSessionSchema = z.object({
  id: uuidSchema,
  workspaceId: uuidSchema,
  name: z.string(),
  shell: z.string(),
  cwd: z.string(),
  createdAt: timestampSchema,
  cols: z.number().int().positive(),
  rows: z.number().int().positive(),
});

export const terminalOutputSchema = z.object({
  sessionId: uuidSchema,
  data: z.string(),
  timestamp: timestampSchema,
});

// ============================================================================
// Settings Schemas
// ============================================================================

export const startupBehaviorSchema = z.enum(['welcome', 'last-workspace', 'new-chat', 'last-mode']);

export const settingsSchema = z.object({
  theme: themeModeSchema,
  fontSize: z.number().int().min(10).max(24).default(14),
  fontFamily: z.string().default('Inter'),
  terminalFontSize: z.number().int().min(10).max(24).default(13),
  terminalFontFamily: z.string().default('JetBrains Mono'),
  autoSave: z.boolean().default(true),
  autoSaveInterval: z.number().int().positive().default(2000),
  language: z.string().default('en'),
  startupBehavior: startupBehaviorSchema.default('welcome'),
  telemetryEnabled: z.boolean().default(false),
  compactMode: z.boolean().default(false),
  animationsEnabled: z.boolean().default(true),
});

export type Settings = z.infer<typeof settingsSchema>;

export const apiKeyEntrySchema = z.object({
  id: uuidSchema,
  providerId: z.string(),
  keyName: z.string(),
  encryptedKey: z.string(),
  createdAt: timestampSchema,
  lastValidated: timestampSchema.optional(),
  isValid: z.boolean().default(false),
});

export const createApiKeyInputSchema = z.object({
  providerId: z.string().optional().default('auto'),
  keyName: z.string().min(1),
  key: z.string().min(1),
});

export const mcpServerConfigSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  command: z.string().min(1),
  args: z.array(z.string()).default([]),
  env: z.record(z.string()).default({}),
  enabled: z.boolean().default(true),
  autoConnect: z.boolean().default(false),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createMcpServerInputSchema = mcpServerConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMcpServerInputSchema = z.object({
  id: uuidSchema,
  updates: mcpServerConfigSchema.partial().omit({ id: true, createdAt: true }),
});

export const mcpToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.unknown()),
  serverId: z.string(),
});

// ============================================================================
// Governance Schemas
// ============================================================================

export const featureStatusSchema = z.enum(['pending', 'in-progress', 'completed']);

export const verificationStatusSchema = z.enum(['not-tested', 'testing', 'verified', 'failed']);

export const featureSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: featureStatusSchema,
  acceptanceCriteria: z.array(z.string()).default([]),
  relevantFiles: z.array(z.string()).default([]),
  verificationStatus: verificationStatusSchema.default('not-tested'),
});

export const featureModuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  features: z.array(featureSchema).default([]),
});

export const featuresContentSchema = z.object({
  modules: z.array(featureModuleSchema).default([]),
});

export const ruleSchema = z.object({
  number: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
});

export const rulesContentSchema = z.object({
  rules: z.array(ruleSchema).length(20),
});

export const updateEntrySchema = z.object({
  date: z.string(),
  description: z.string(),
  affectedFiles: z.array(z.string()).default([]),
  justification: z.string(),
  implementation: z.string(),
  dependencies: z.array(z.string()).default([]),
  compatibility: z.string(),
  testing: z.string(),
});

export const updateContentSchema = z.object({
  entries: z.array(updateEntrySchema).default([]),
});

export const blockerSchema = z.object({
  description: z.string(),
  type: z.enum(['missing-requirement', 'decision-needed', 'technical-issue', 'external-dependency']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});

export const nextActionSchema = z.object({
  step: z.number().int().positive(),
  description: z.string(),
  estimatedTime: z.string(),
});

export const flowContentSchema = z.object({
  activeObjective: z.string(),
  projectContext: z.object({
    frameworks: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    architecture: z.string(),
    implementationDetails: z.string(),
  }),
  currentFiles: z.array(z.object({
    path: z.string(),
    functions: z.array(z.string()).default([]),
    components: z.array(z.string()).default([]),
  })).default([]),
  completedWork: z.array(z.string()).default([]),
  pendingWork: z.array(z.string()).default([]),
  validation: z.object({
    testsExecuted: z.array(z.string()).default([]),
    buildResults: z.string(),
    knownFailures: z.array(z.string()).default([]),
  }),
  blockers: z.array(blockerSchema).default([]),
  nextActions: z.array(nextActionSchema).default([]),
});

// ============================================================================
// IPC Validation Helpers
// ============================================================================

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')}`);
  }
  return result.data;
}

export function validateOutput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Output validation failed:', result.error);
    // In production, we might want to throw or handle differently
    return data as T;
  }
  return result.data;
}

// ============================================================================
// End of Schemas
// ============================================================================