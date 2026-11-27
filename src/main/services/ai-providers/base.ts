/**
 * EXCO AI Provider Base Interface
 * Abstract base class for all AI providers
 */

import type {
  AIProvider,
  AIModel,
  Message,
  StreamChunk,
  TokenUsage,
  ToolCall,
} from '@shared/types';

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  customHeaders?: Record<string, string>;
}

export interface ModelCapabilities {
  streaming: boolean;
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
  systemPrompts: boolean;
}

export interface CompletionOptions {
  model: string;
  messages: Message[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  toolChoice?: 'auto' | 'none' | 'required' | { type: 'function'; name: string };
  stream?: boolean;
  reasoningEffort?: 'low' | 'medium' | 'high';
  signal?: AbortSignal;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface CompletionResponse {
  content: string;
  model?: string;
  toolCalls?: ToolCall[];
  usage?: TokenUsage;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'error';
}

export interface StreamCallbacks {
  onReasoning?: (reasoning: string) => void;
  onContent?: (content: string) => void;
  onToolCall?: (toolCall: ToolCall) => void;
  onToolResult?: (toolCallId: string, result: unknown) => void;
  onDone?: (usage?: TokenUsage) => void;
  onError?: (error: Error) => void;
}

export abstract class BaseAIProvider {
  protected config: ProviderConfig;
  protected provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
    this.config = provider.config;
  }

  abstract getId(): string;
  abstract getName(): string;
  abstract getType(): AIProvider['type'];
  abstract getCapabilities(): ModelCapabilities;
  abstract listModels(): Promise<AIModel[]>;
  abstract validateConnection(): Promise<{ success: boolean; error?: string }>;

  abstract complete(options: CompletionOptions): Promise<CompletionResponse>;
  abstract streamComplete(options: CompletionOptions, callbacks: StreamCallbacks): Promise<void>;

  // Helper methods
  protected formatMessages(messages: Message[]): any[] {
    return messages.map(msg => {
      if (typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }
      // Handle multimodal content
      return {
        role: msg.role,
        content: msg.content.map(part => {
          if (part.type === 'text') return { type: 'text', text: part.text };
          if (part.type === 'image') return { type: 'image_url', image_url: { url: part.imageUrl } };
          if (part.type === 'file') return { type: 'file', file: part.fileData };
          return { type: 'text', text: '' };
        }),
      };
    });
  }

  protected formatTools(tools?: ToolDefinition[]): any[] | undefined {
    if (!tools || tools.length === 0) return undefined;
    return tools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  updateConfig(config: Partial<ProviderConfig>): void {
    this.config = { ...this.config, ...config };
    this.provider.config = this.config;
  }
}

// ============================================================================
// Provider Registry
// ============================================================================

type ProviderConstructor = new (provider: AIProvider) => BaseAIProvider;

const providerRegistry: Map<string, ProviderConstructor> = new Map();

export function registerProvider(type: string, constructor: ProviderConstructor): void {
  providerRegistry.set(type, constructor);
}

export function getProviderConstructor(type: string): ProviderConstructor | undefined {
  return providerRegistry.get(type);
}

export function createProvider(provider: AIProvider): BaseAIProvider {
  const Constructor = providerRegistry.get(provider.type);
  if (!Constructor) {
    throw new Error(`No provider registered for type: ${provider.type}`);
  }
  return new Constructor(provider);
}

export function getRegisteredProviders(): string[] {
  return Array.from(providerRegistry.keys());
}