/**
 * EXCO Google Gemini AI Provider
 * Implementation for Google Gemini models (Gemini 3.8 Flash High, 2.5 Pro/Flash, 1.5 Pro/Flash)
 */

import { BaseAIProvider, registerProvider, type CompletionOptions, type CompletionResponse, type StreamCallbacks } from './base';
import { inferModelTier } from '@shared/utils';
import type { AIProvider, AIModel, TokenUsage } from '@shared/types';

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

interface GeminiGenerateContentRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: GeminiPart[];
  };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
    thinkingConfig?: {
      thinkingBudget?: number;
    };
  };
}

export class GeminiProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(provider: AIProvider) {
    super(provider);
    this.baseUrl = this.getBaseUrl();
  }

  private getBaseUrl(): string {
    const raw = (this.config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta').trim().replace(/\/+$/, '');
    if (/\/v1(beta)?$/i.test(raw)) return raw;
    return `${raw}/v1beta`;
  }

  getId(): string {
    return this.provider.id && this.provider.id !== 'custom' ? this.provider.id : 'google';
  }

  getName(): string {
    if (this.provider.name && this.provider.name !== this.provider.type && this.provider.name !== 'custom') {
      return this.provider.name;
    }
    return 'Google Gemini';
  }

  getType(): AIProvider['type'] {
    return 'google';
  }

  getCapabilities() {
    return {
      streaming: true,
      tools: true,
      vision: true,
      reasoning: true,
      systemPrompts: true,
    };
  }

  async listModels(): Promise<AIModel[]> {
    const apiKey = this.config.apiKey || process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const resp = await fetch(`${this.getBaseUrl()}/models`, {
          headers: { 'x-goog-api-key': apiKey },
        });
        if (resp.ok) {
          const data: any = await resp.json();
          const rawList = Array.isArray(data?.models) ? data.models : [];
          const chatModels = rawList.filter((m: any) => {
            const methods: string[] = Array.isArray(m?.supportedGenerationMethods) ? m.supportedGenerationMethods : [];
            const id = String(m?.name || '').replace(/^models\//, '').toLowerCase();
            return methods.includes('generateContent') && !id.includes('embedding') && !id.includes('aqa') && !id.includes('imagen') && !id.includes('veo');
          });
          if (chatModels.length > 0) {
            return chatModels.map((m: any) => {
              const id = String(m.name || '').replace(/^models\//, '');
              const lower = id.toLowerCase();
              return {
                id,
                name: m.displayName || id,
                providerId: this.provider.id,
                capabilities: {
                  chat: true,
                  completion: true,
                  embedding: false,
                  imageGeneration: false,
                  audioTranscription: !lower.includes('gemma'),
                },
                contextWindow: Number(m.inputTokenLimit) || 1048576,
                maxOutputTokens: Number(m.outputTokenLimit) || 8192,
                supportsStreaming: true,
                supportsTools: !lower.includes('gemma'),
                supportsVision: !lower.includes('gemma'),
                supportsReasoning: lower.includes('pro') || lower.includes('thinking') || lower.includes('2.5'),
                tier: inferModelTier({ id }, 'google', apiKey),
                isAvailable: true,
              } as AIModel;
            });
          }
        }
      } catch {}
    }
    return this.getDefaultModels();
  }

  private getDefaultModels(): AIModel[] {
    return [
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: true, embedding: false, imageGeneration: false, audioTranscription: true },
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: true,
        tier: 'free',
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: true, embedding: false, imageGeneration: false, audioTranscription: true },
        contextWindow: 2097152,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: true,
        tier: 'paid',
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: true, embedding: false, imageGeneration: false, audioTranscription: true },
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
        tier: 'free',
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: true, embedding: false, imageGeneration: false, audioTranscription: true },
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
        tier: 'free',
      },
    ];
  }

  async validateConnection(): Promise<{ success: boolean; error?: string }> {
    const apiKey = this.config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'No API key provided' };
    }

    try {
      const response = await fetch(`${this.getBaseUrl()}/models`, {
        headers: { 'x-goog-api-key': apiKey },
      });
      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Google API returned status ${response.status}: ${error}` };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Connection failed' };
    }
  }

  private buildContentsAndRequest(options: CompletionOptions, modelName: string): GeminiGenerateContentRequest {
    const rawContents: GeminiContent[] = options.messages.map(msg => {
      if (typeof msg.content === 'string') {
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        };
      }
      const parts: GeminiPart[] = (msg.content as any[]).map(part => {
        if (part.type === 'text') {
          return { text: part.text || '' };
        }
        if (part.type === 'image' && part.imageUrl) {
          const match = part.imageUrl.match(/^data:(.+);base64,(.+)$/);
          if (match) {
            return { inlineData: { mimeType: match[1], data: match[2] } };
          }
        }
        if (part.type === 'file' && part.fileData) {
          const fd = part.fileData;
          if (fd.textContent) {
            return {
              text: `\n[Attached File: ${fd.name} (${fd.mimeType || 'text/plain'}, ${fd.size} bytes)]\n\`\`\`\n${fd.textContent}\n\`\`\``,
            };
          }
          if (
            fd.base64 &&
            (fd.mimeType?.startsWith('image/') ||
              fd.mimeType?.startsWith('audio/') ||
              fd.mimeType?.startsWith('video/') ||
              fd.mimeType === 'application/pdf')
          ) {
            return { inlineData: { mimeType: fd.mimeType, data: fd.base64 } };
          }
          return {
            text: `[Attached File: ${fd.name} (${fd.mimeType || 'application/octet-stream'}, ${fd.size} bytes)]`,
          };
        }
        return { text: '' };
      }).filter(p => Boolean(p.text || p.inlineData));

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: parts.length > 0 ? parts : [{ text: '' }],
      };
    });

    // Merge consecutive same-role turns so Gemini never rejects back-to-back user/model items
    const contents: GeminiContent[] = [];
    for (const item of rawContents) {
      const prev = contents[contents.length - 1];
      if (prev && prev.role === item.role) {
        prev.parts.push(...item.parts);
      } else {
        contents.push({ role: item.role, parts: [...item.parts] });
      }
    }

    const generationConfig: GeminiGenerateContentRequest['generationConfig'] = {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 8192,
    };

    // Disable hidden thinking delay on Gemini 2.5 Flash for crisp low-latency voice turns
    if (modelName.includes('2.5-flash') && !modelName.includes('pro') && options.maxTokens && options.maxTokens <= 1024) {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }

    const reqBody: GeminiGenerateContentRequest = {
      contents,
      generationConfig,
    };

    if (options.systemPrompt) {
      reqBody.systemInstruction = {
        parts: [{ text: options.systemPrompt }],
      };
    }

    return reqBody;
  }

  async complete(options: CompletionOptions): Promise<CompletionResponse> {
    const apiKey = this.config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add your API key in the Sidebar > API Keys panel.');
    }

    const modelName = this.normalizeModelName(options.model);
    const reqBody = this.buildContentsAndRequest(options, modelName);

    const response = await fetch(`${this.getBaseUrl()}/models/${modelName}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(reqBody),
      signal: options.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const candidate = data.candidates?.[0];
    const text =
      candidate?.content?.parts
        ?.filter((p: any) => typeof p?.text === 'string' && !p.thought)
        .map((p: any) => p.text)
        .join('') || '';

    const usage: TokenUsage | undefined = data.usageMetadata ? {
      inputTokens: data.usageMetadata.promptTokenCount || 0,
      outputTokens: data.usageMetadata.candidatesTokenCount || 0,
      totalTokens: data.usageMetadata.totalTokenCount || 0,
    } : undefined;

    return {
      content: text,
      model: modelName,
      usage,
      finishReason: 'stop',
    };
  }

  async streamComplete(options: CompletionOptions, callbacks: StreamCallbacks): Promise<void> {
    const apiKey = this.config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      callbacks.onError?.(new Error('Gemini API key is not configured. Please add your API key in the Sidebar > API Keys panel.'));
      return;
    }

    const modelName = this.normalizeModelName(options.model);
    const reqBody = this.buildContentsAndRequest(options, modelName);

    try {
      const response = await fetch(`${this.getBaseUrl()}/models/${modelName}:streamGenerateContent?alt=sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(reqBody),
        signal: options.signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText);
        callbacks.onError?.(new Error(`Gemini API Error (${response.status}): ${errText}`));
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const result = await this.complete(options);
        if (result.content) callbacks.onContent?.(result.content);
        callbacks.onDone?.(result.usage);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let lastUsage: TokenUsage | undefined;

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
            const payload: any = JSON.parse(jsonStr);
            if (payload?.error) {
              callbacks.onError?.(new Error(`Gemini API Error: ${payload.error.message || JSON.stringify(payload.error)}`));
              return;
            }
            const parts: any[] = payload?.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              if (part?.thought) {
                if (typeof part.text === 'string' && part.text) {
                  callbacks.onReasoning?.(part.text);
                }
                continue;
              }
              if (typeof part?.text === 'string' && part.text) {
                callbacks.onContent?.(part.text);
              }
            }
            if (payload?.usageMetadata) {
              lastUsage = {
                inputTokens: payload.usageMetadata.promptTokenCount || 0,
                outputTokens: payload.usageMetadata.candidatesTokenCount || 0,
                totalTokens: payload.usageMetadata.totalTokenCount || 0,
              };
            }
          } catch {}
        }
      }

      callbacks.onDone?.(lastUsage);
    } catch (err: any) {
      if (callbacks.onError) {
        callbacks.onError(err instanceof Error ? err : new Error(String(err || 'Gemini stream failed')));
      } else {
        throw err;
      }
    }
  }

  private normalizeModelName(model: string): string {
    const raw = (model || '').trim().replace(/^models\//, '');
    const lower = raw.toLowerCase();
    if (!raw || lower === 'auto' || lower === 'default') return 'gemini-2.5-flash';
    // Pass through real fetched Gemini or Gemma API model IDs verbatim
    if ((lower.startsWith('gemini-') || lower.startsWith('gemma-')) && !lower.includes(' ')) {
      return lower;
    }
    if (lower.includes('3.8') || lower.includes('flash high')) return 'gemini-2.5-flash';
    if (lower.includes('2.5') && lower.includes('pro')) return 'gemini-2.5-pro';
    if (lower.includes('2.5') && lower.includes('flash')) return 'gemini-2.5-flash';
    if (lower.includes('2.0') && lower.includes('flash')) return 'gemini-2.0-flash';
    if (lower.includes('1.5') && lower.includes('pro')) return 'gemini-1.5-pro';
    if (lower.includes('1.5') && lower.includes('flash')) return 'gemini-1.5-flash';
    return 'gemini-2.5-flash';
  }
}

// Register with registry
registerProvider('google', GeminiProvider);
