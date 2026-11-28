/**
 * EXCO OpenAI AI Provider
 * Implementation for OpenAI GPT models
 */

import { BaseAIProvider, registerProvider, type CompletionOptions, type CompletionResponse, type StreamCallbacks } from './base';
import { resolveApiKeyProfile, inferModelTier } from '@shared/utils';
import type { AIProvider, AIModel, TokenUsage, ToolCall } from '@shared/types';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

interface OpenAITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  tools?: OpenAITool[];
  tool_choice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };
  stream?: boolean;
  stream_options?: { include_usage: boolean };
}

interface OpenAIResponse {
  id: string;
  object: 'chat.completion';
  choices: Array<{
    index: number;
    message: OpenAIMessage;
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIStreamChunk {
  id: string;
  object: 'chat.completion.chunk';
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      tool_calls?: Array<{
        index: number;
        id?: string;
        type?: 'function';
        function?: { name?: string; arguments?: string };
      }>;
    };
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(provider: AIProvider) {
    super(provider);
    this.baseUrl = this.resolveBaseUrl(this.config.baseUrl);
  }

  private resolveBaseUrl(configuredUrl?: string): string {
    const trimmed = configuredUrl?.trim().replace(/\/+$/, '');
    if (trimmed) return trimmed;
    if (this.config.apiKey) {
      const profile = resolveApiKeyProfile(this.config.apiKey, this.provider.type);
      if (profile.baseUrl) return profile.baseUrl;
    }
    switch (this.provider.type) {
      case 'ollama':
        return 'http://localhost:11434';
      case 'openrouter':
        return 'https://openrouter.ai/api';
      case 'openai':
        return 'https://api.openai.com';
      default:
        return '';
    }
  }

  private buildEndpoint(resourcePath: string): string {
    const base = this.resolveBaseUrl(this.config.baseUrl);
    if (!base) {
      throw new Error(`No Base URL configured for provider "${this.getName()}". Open Settings > AI Providers to set its Base URL.`);
    }
    const cleanBase = base.replace(/\/+$/, '');
    // Avoid duplicating /v1 if the user already included /v1 in their Base URL
    if (cleanBase.endsWith('/v1') && resourcePath.startsWith('/v1/')) {
      return `${cleanBase}${resourcePath.slice(3)}`;
    }
    return `${cleanBase}${resourcePath}`;
  }

  getId(): string {
    return this.provider.id || this.provider.type || 'custom';
  }

  getName(): string {
    if (this.provider.name && this.provider.name !== this.provider.type) {
      return this.provider.name;
    }
    if (this.config.apiKey) {
      const profile = resolveApiKeyProfile(this.config.apiKey, this.provider.type);
      if (profile.displayName && profile.displayName !== 'Custom API') {
        return profile.displayName;
      }
    }
    switch (this.provider.type) {
      case 'openrouter':
        return 'OpenRouter';
      case 'ollama':
        return 'Ollama';
      case 'custom':
        return 'Custom API';
      default:
        return 'OpenAI';
    }
  }

  getType(): AIProvider['type'] {
    return this.provider.type || 'custom';
  }

  getCapabilities() {
    return {
      streaming: true,
      tools: true,
      vision: true,
      reasoning: false,
      systemPrompts: true,
    };
  }

  async listModels(): Promise<AIModel[]> {
    let base = '';
    try {
      base = this.resolveBaseUrl(this.config.baseUrl);
    } catch {
      return this.getDefaultModels();
    }
    if (!base) {
      return this.getDefaultModels();
    }

    const cleanBase = base.replace(/\/+$/, '');
    const candidateUrls: string[] = [];
    const primaryUrl = this.buildEndpoint('/v1/models');
    candidateUrls.push(primaryUrl);

    // Some custom REST endpoints serve /models directly without /v1 prefix
    const directModelsUrl = `${cleanBase}/models`;
    if (!candidateUrls.includes(directModelsUrl)) {
      candidateUrls.push(directModelsUrl);
    }
    // Cloudflare Workers AI account URLs may expose catalog via /ai/models/search
    if (cleanBase.includes('api.cloudflare.com/client/v4/accounts/') && !cleanBase.includes('models/search')) {
      const cfBase = cleanBase.replace(/\/ai\/v1$/, '/ai').replace(/\/v1$/, '');
      candidateUrls.push(`${cfBase}/models/search`);
    }

    const extractRawList = (data: any): any[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.models)) return data.models;
      if (Array.isArray(data.result)) return data.result;
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.records)) return data.records;
      if (Array.isArray(data.list)) return data.list;
      if (Array.isArray(data.results)) return data.results;
      if (data.data && typeof data.data === 'object') {
        if (Array.isArray(data.data.models)) return data.data.models;
        if (Array.isArray(data.data.items)) return data.data.items;
        if (Array.isArray(data.data.list)) return data.data.list;
      }
      return [];
    };

    try {
      const baseHeaders = this.getHeaders();
      const headerVariants: Record<string, string>[] = [baseHeaders];
      if (this.config.apiKey) {
        headerVariants.push({
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
        });
      }

      let rawList: any[] = [];
      for (const url of candidateUrls) {
        for (let hIdx = 0; hIdx < headerVariants.length; hIdx++) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4500);
          try {
            const response = await fetch(url, {
              headers: headerVariants[hIdx],
              signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));

            if (response.ok) {
              const data: any = await response.json().catch(() => null);
              const extracted = extractRawList(data);
              if (extracted.length > 0) {
                rawList = extracted;
                break;
              }
            } else if (response.status !== 401 && response.status !== 403) {
              // Auth errors retry with alternate header (e.g. x-api-key); other statuses advance to next URL
              break;
            }
          } catch {
            break;
          }
        }
        if (rawList.length > 0) break;
      }

      if (rawList.length === 0) {
        const keyProfile = resolveApiKeyProfile(this.config.apiKey || '', this.provider.type, this.provider.name);
        if (Array.isArray(this.provider.models) && this.provider.models.length > 0) {
          return this.provider.models;
        }
        if (keyProfile.defaultModel && this.getType() !== 'openai') {
          return [{
            id: keyProfile.defaultModel,
            name: keyProfile.defaultModel,
            providerId: this.provider.id,
            capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
            contextWindow: 128000,
            maxOutputTokens: 8192,
            supportsStreaming: true,
            supportsTools: true,
            supportsVision: false,
            supportsReasoning: false,
            tier: keyProfile.tier,
            isAvailable: true,
          }];
        }
        return this.getDefaultModels();
      }

      const normalized = rawList
        .map((entry: any) => (typeof entry === 'string' ? { id: entry, name: entry } : entry))
        .filter((m: any) => m && typeof m === 'object');

      const accessibleList = normalized.filter(
        (m: any) =>
          m?.available !== false &&
          m?.accessible !== false &&
          m?.allowed !== false &&
          m?.entitled !== false &&
          m?.requires_payment !== true
      );
      const filtered = this.getType() === 'openai'
        ? accessibleList.filter((m: any) => {
            const idStr = String(m?.id || m?.model || m?.modelId || m?.slug || m?.name || '');
            if (!idStr) return false;
            const idL = idStr.toLowerCase();
            if (/(embed|whisper|tts|dall-e|moderation|transcribe|realtime|audio|search|sora|gpt-image|babbage|davinci)/.test(idL)) {
              return false;
            }
            return idL.includes('gpt') || /^o[134](-|$)/.test(idL) || idL.startsWith('chatgpt');
          })
        : accessibleList;

      return filtered
        .map((m: any) => {
          const modelId = String(m.id || m.model || m.modelId || m.model_id || m.slug || m.key || m.name || '').trim();
          if (!modelId) return null;
          const contextWindow =
            Number(m.context_window) ||
            Number(m.context_length) ||
            Number(m.max_model_len) ||
            Number(m.top_provider?.context_length) ||
            this.getContextWindow(modelId);
          const maxOut =
            Number(m.max_output_tokens) ||
            Number(m.top_provider?.max_completion_tokens) ||
            this.getMaxOutput(modelId);
          const promptCost = Number(m.pricing?.prompt ?? 0);
          const completionCost = Number(m.pricing?.completion ?? 0);
          const keyProfile = resolveApiKeyProfile(this.config.apiKey || '', this.provider.type, this.provider.name);
          const resolvedTier = inferModelTier(
            {
              id: modelId,
              tier: m.tier,
              free: m.free,
              pricing: m.pricing ? { prompt: promptCost, completion: completionCost } : undefined,
            },
            keyProfile,
            this.config.apiKey
          );

          return {
            id: modelId,
            name: String(m.name || modelId),
            providerId: this.provider.id,
            capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
            contextWindow,
            maxOutputTokens: maxOut,
            supportsStreaming: true,
            supportsTools: this.supportsTools(modelId),
            supportsVision: this.supportsVision(modelId),
            supportsReasoning: false,
            tier: resolvedTier,
            isAvailable: typeof m.available === 'boolean' ? m.available : true,
          };
        })
        .filter(Boolean) as AIModel[];
    } catch {
      return this.getDefaultModels();
    }
  }

  private getDefaultModels(): AIModel[] {
    if (this.getType() !== 'openai') {
      return this.provider.models || [];
    }
    return [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 128000,
        maxOutputTokens: 16384,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 128000,
        maxOutputTokens: 16384,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 128000,
        maxOutputTokens: 4096,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 16385,
        maxOutputTokens: 4096,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: false,
        supportsReasoning: false,
      },
    ];
  }

  private getContextWindow(modelId: string): number {
    const id = modelId.toLowerCase();
    if (id.includes('gpt-4.1') || id.includes('gemini-')) return 1048576;
    if (id.includes('gpt-5')) return 400000;
    if (/^o[134](-|$)/.test(id) || id.includes('/o1') || id.includes('/o3') || id.includes('/o4')) return 200000;
    if (id.includes('codestral') || id.includes('command-a') || id.includes('mistral-large')) return 256000;
    if (
      id.includes('gpt-4o') ||
      id.includes('gpt-4-turbo') ||
      id.includes('deepseek') ||
      id.includes('llama-3.') ||
      id.includes('llama-4') ||
      id.includes('qwen') ||
      id.includes('mistral') ||
      id.includes('gemma-3') ||
      id.includes('aya') ||
      id.includes('command') ||
      id.includes('nemotron')
    ) {
      return 128000;
    }
    if (id.includes('gpt-3.5')) return 16385;
    return 32768;
  }

  private getMaxOutput(modelId: string): number {
    if (modelId.includes('gpt-4o')) return 16384;
    if (modelId.includes('gpt-4-turbo')) return 4096;
    return 4096;
  }

  private supportsTools(modelId: string): boolean {
    return !modelId.includes('gpt-3.5-turbo-instruct');
  }

  private supportsVision(modelId: string): boolean {
    return modelId.includes('gpt-4o') || modelId.includes('gpt-4-turbo');
  }

  async validateConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.config.apiKey && this.getType() !== 'ollama' && this.getType() !== 'custom') {
      return { success: false, error: 'No API key configured' };
    }

    try {
      const response = await fetch(this.buildEndpoint('/v1/models'), {
        headers: this.getHeaders(),
      });

      if (response.ok) {
        return { success: true };
      }

      const error: any = await response.json().catch(() => ({}));
      return { success: false, error: error?.error?.message || `HTTP ${response.status}` };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
    }
  }

  private async resolveModelName(requestedModel?: string): Promise<string> {
    if (requestedModel && requestedModel !== 'default') return requestedModel;
    if (this.config.apiKey?.trim().startsWith('freellma')) return 'auto';
    if (this.getType() !== 'openai') {
      try {
        const models = await this.listModels();
        if (models.length > 0 && models[0].id) return models[0].id;
      } catch {}
      return 'auto';
    }
    return 'gpt-4o-mini';
  }

  async complete(options: CompletionOptions): Promise<CompletionResponse> {
    const model = await this.resolveModelName(options.model);
    const request = this.buildRequest({ ...options, model }, false);
    const primaryEndpoint = this.buildEndpoint('/v1/chat/completions');
    const isAutoFreeLlm = !this.config.baseUrl?.trim() && this.config.apiKey?.trim().startsWith('freellma');
    const candidateEndpoints = isAutoFreeLlm
      ? [primaryEndpoint, 'http://localhost:3001/v1/chat/completions']
      : [primaryEndpoint];

    let response: Response | null = null;
    let lastEndpoint = primaryEndpoint;
    for (const endpoint of candidateEndpoints) {
      if (options.signal?.aborted) {
        throw new Error('Request aborted');
      }
      lastEndpoint = endpoint;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(request),
          signal: options.signal,
        });
        break;
      } catch (err: any) {
        if (options.signal?.aborted || err?.name === 'AbortError') {
          throw err;
        }
        response = null;
      }
    }

    if (!response) {
      throw new Error(`Could not connect to ${this.getName()} (${lastEndpoint}). Make sure the server is running or update its Base URL in Settings > AI Providers.`);
    }

    if (!response.ok) {
      const error: any = await response.json().catch(() => ({}));
      throw new Error(`${this.getName()} API error: ${error?.error?.message || response.statusText || `HTTP ${response.status}`}`);
    }

    const data: OpenAIResponse = (await response.json()) as any;
    return this.parseResponse(data);
  }

  async streamComplete(options: CompletionOptions, callbacks: StreamCallbacks): Promise<void> {
    const model = await this.resolveModelName(options.model);
    const request = this.buildRequest({ ...options, model }, true);
    const endpoint = this.buildEndpoint('/v1/chat/completions');
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
        signal: options.signal,
      });
    } catch (err: any) {
      if (err?.name === 'AbortError' || options.signal?.aborted) {
        callbacks.onError?.(err instanceof Error ? err : new Error('Aborted'));
        return;
      }
      callbacks.onError?.(new Error(`Could not connect to ${this.getName()} (${endpoint}). Make sure the server is running or update its Base URL in Settings > AI Providers.`));
      return;
    }

    if (!response.ok) {
      const error: any = await response.json().catch(() => ({}));
      callbacks.onError?.(new Error(`${this.getName()} API error: ${error?.error?.message || response.statusText || `HTTP ${response.status}`}`));
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError?.(new Error('No response body'));
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    const toolCalls: Map<number, Partial<ToolCall>> = new Map();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const chunk: OpenAIStreamChunk = JSON.parse(jsonStr);
            if ((chunk as any)?.error) {
              const errMsg = (chunk as any).error?.message || JSON.stringify((chunk as any).error);
              callbacks.onError?.(new Error(`${this.getName()} stream error: ${errMsg}`));
              return;
            }
            this.handleStreamChunk(chunk, callbacks, toolCalls);
          } catch {}
        }
      }

      callbacks.onDone?.();
    } catch (error) {
      callbacks.onError?.(error instanceof Error ? error : new Error('Stream error'));
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.customHeaders,
    };
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    if (this.config.organization) {
      headers['OpenAI-Organization'] = this.config.organization;
    }
    return headers;
  }

  private buildRequest(options: CompletionOptions, stream: boolean): OpenAIRequest {
    const { model, messages, systemPrompt, temperature, maxTokens, tools, toolChoice } = options;

    const request: OpenAIRequest = {
      model,
      messages: this.formatMessagesForOpenAI(messages, systemPrompt),
      stream,
    };

    if (temperature !== undefined) {
      request.temperature = temperature;
    }

    if (maxTokens) {
      request.max_tokens = maxTokens;
    }

    if (tools && tools.length > 0) {
      request.tools = tools.map(t => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      }));
    }

    if (toolChoice) {
      if (toolChoice === 'auto' || toolChoice === 'none') {
        request.tool_choice = toolChoice;
      } else if (toolChoice === 'required') {
        request.tool_choice = 'required';
      } else if (toolChoice.type === 'function') {
        request.tool_choice = { type: 'function', function: { name: toolChoice.name } };
      }
    }

    if (stream) {
      const base = (this.resolveBaseUrl(this.config.baseUrl) || '').toLowerCase();
      const supportsStreamUsage =
        base.includes('api.openai.com') ||
        base.includes('groq.com') ||
        base.includes('openrouter.ai') ||
        base.includes('deepseek.com') ||
        base.includes('cerebras.ai') ||
        base.includes('together.xyz') ||
        base.includes('fireworks.ai');
      if (supportsStreamUsage) {
        request.stream_options = { include_usage: true };
      }
    }

    return request;
  }

  private formatMessagesForOpenAI(messages: CompletionOptions['messages'], systemPrompt?: string): OpenAIMessage[] {
    const formatted: OpenAIMessage[] = [];

    if (systemPrompt) {
      formatted.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      // Skip empty placeholder or failed assistant error messages so upstream gateways don't 400
      if (msg.role === 'assistant' && (!msg.content || (typeof msg.content === 'string' && (!msg.content.trim() || msg.content.startsWith('Error generating response'))))) {
        continue;
      }
      if (typeof msg.content === 'string') {
        formatted.push({ role: msg.role, content: msg.content });
      } else {
        formatted.push({
          role: msg.role,
          content: msg.content.map((part: any) => {
            if (part.type === 'text') {
              return { type: 'text', text: part.text || '' };
            }
            if (part.type === 'image' && part.imageUrl) {
              return { type: 'image_url', image_url: { url: part.imageUrl } };
            }
            if (part.type === 'file' && part.fileData) {
              const fd = part.fileData;
              if (fd.mimeType?.startsWith('image/') && fd.base64) {
                return { type: 'image_url', image_url: { url: `data:${fd.mimeType};base64,${fd.base64}` } };
              }
              if (fd.textContent) {
                return {
                  type: 'text',
                  text: `\n[Attached File: ${fd.name} (${fd.mimeType || 'text/plain'}, ${fd.size} bytes)]\n\`\`\`\n${fd.textContent}\n\`\`\``,
                };
              }
              return {
                type: 'text',
                text: `[Attached File: ${fd.name} (${fd.mimeType || 'application/octet-stream'}, ${fd.size} bytes)]`,
              };
            }
            return { type: 'text', text: '' };
          }),
        });
      }
    }

    return formatted;
  }

  private handleStreamChunk(
    chunk: OpenAIStreamChunk,
    callbacks: StreamCallbacks,
    toolCalls: Map<number, Partial<ToolCall>>
  ): void {
    const choice = chunk.choices?.[0];
    if (!choice) return;

    const reasoningDelta = (choice.delta as any)?.reasoning_content || (choice.delta as any)?.reasoning;
    if (reasoningDelta) {
      callbacks.onReasoning?.(reasoningDelta);
    }

    if (choice.delta.content) {
      callbacks.onContent?.(choice.delta.content);
    }

    if (choice.delta.tool_calls) {
      for (const tc of choice.delta.tool_calls) {
        const index = tc.index ?? 0;
        let toolCall = toolCalls.get(index);

        if (!toolCall) {
          toolCall = { id: '', name: '', arguments: {} };
          toolCalls.set(index, toolCall);
        }

        if (tc.id) toolCall.id = tc.id;
        if (tc.function?.name) toolCall.name = tc.function.name;
        if (tc.function?.arguments) {
          try {
            toolCall.arguments = { ...toolCall.arguments, ...JSON.parse(tc.function.arguments) };
          } catch {}
        }
      }
    }

    if (choice.finish_reason === 'tool_calls') {
      for (const toolCall of toolCalls.values()) {
        if (toolCall.id && toolCall.name) {
          callbacks.onToolCall?.(toolCall as ToolCall);
        }
      }
      toolCalls.clear();
    }

    if (chunk.usage) {
      callbacks.onDone?.({
        inputTokens: chunk.usage.prompt_tokens,
        outputTokens: chunk.usage.completion_tokens,
        totalTokens: chunk.usage.total_tokens,
      });
    }
  }

  private parseResponse(data: OpenAIResponse): CompletionResponse {
    if ((data as any)?.error) {
      const errMsg = (data as any).error?.message || JSON.stringify((data as any).error);
      throw new Error(`${this.getName()} API error: ${errMsg}`);
    }
    const choice = data.choices?.[0];
    if (!choice) {
      return { content: '', finishReason: 'stop' };
    }

    const toolCalls: ToolCall[] = [];
    if (choice.message?.tool_calls) {
      for (const tc of choice.message.tool_calls) {
        let parsedArgs: Record<string, unknown> = {};
        if (typeof tc.function?.arguments === 'string' && tc.function.arguments.trim()) {
          try {
            parsedArgs = JSON.parse(tc.function.arguments);
          } catch {}
        } else if (tc.function?.arguments && typeof tc.function.arguments === 'object') {
          parsedArgs = tc.function.arguments as any;
        }
        toolCalls.push({
          id: tc.id,
          name: tc.function?.name || '',
          arguments: parsedArgs,
        });
      }
    }

    const finishReasonMap: Record<string, CompletionResponse['finishReason']> = {
      stop: 'stop',
      length: 'length',
      tool_calls: 'tool_calls',
      content_filter: 'content_filter',
    };

    const usage = data.usage && typeof data.usage.prompt_tokens === 'number'
      ? {
          inputTokens: data.usage.prompt_tokens || 0,
          outputTokens: data.usage.completion_tokens || 0,
          totalTokens: data.usage.total_tokens || 0,
        }
      : undefined;

    const rawMsgContent = choice.message?.content;
    const textContent =
      typeof rawMsgContent === 'string'
        ? rawMsgContent
        : Array.isArray(rawMsgContent)
        ? (rawMsgContent as any[]).map(p => (typeof p === 'string' ? p : p?.text || '')).join('')
        : '';

    return {
      content: textContent,
      model: (data as any).model || undefined,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage,
      finishReason: finishReasonMap[choice.finish_reason] || 'stop',
    };
  }
}

// Register provider and OpenAI-compatible backends
registerProvider('openai', OpenAIProvider);
registerProvider('openrouter', OpenAIProvider);
registerProvider('custom', OpenAIProvider);
registerProvider('ollama', OpenAIProvider);