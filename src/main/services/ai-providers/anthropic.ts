/**
 * EXCO Anthropic AI Provider
 * Implementation for Anthropic Claude models
 */

import { BaseAIProvider, registerProvider, type ProviderConfig, type CompletionOptions, type CompletionResponse, type StreamCallbacks } from './base';
import type { AIProvider, AIModel, TokenUsage, ToolCall } from '@shared/types';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | Array<{ type: 'text'; text: string } | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }>;
}

interface AnthropicTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

interface AnthropicRequest {
  model: string;
  messages: AnthropicMessage[];
  system?: string;
  temperature?: number;
  max_tokens: number;
  tools?: AnthropicTool[];
  tool_choice?: { type: 'auto' | 'any' | 'tool'; name?: string };
  stream?: boolean;
  thinking?: { type: 'enabled'; budget_tokens: number };
}

interface AnthropicResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{ type: 'text'; text: string } | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }>;
  model: string;
  stop_reason: 'end_turn' | 'max_tokens' | 'tool_use' | 'stop_sequence';
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicStreamEvent {
  type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop' | 'error';
  message?: AnthropicResponse;
  index?: number;
  delta?: {
    type: 'text_delta' | 'tool_use_delta';
    text?: string;
    partial_json?: string;
  };
  usage?: { input_tokens: number; output_tokens: number };
}

export class AnthropicProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(provider: AIProvider) {
    super(provider);
    this.baseUrl = this.config.baseUrl || 'https://api.anthropic.com';
  }

  getId(): string {
    return this.provider.id || 'anthropic';
  }

  getName(): string {
    return 'Anthropic';
  }

  getType(): AIProvider['type'] {
    return 'anthropic';
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
    // Return known models (Anthropic doesn't have a models list endpoint)
    return [
      {
        id: 'claude-opus-4-5',
        name: 'Claude Opus 4.5',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: true,
      },
      {
        id: 'claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: true,
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        providerId: this.provider.id,
        capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
      },
    ];
  }

  async validateConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.config.apiKey) {
      return { success: false, error: 'No API key configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        return { success: true };
      }

      const error: any = await response.json();
      return { success: false, error: error.error?.message || `HTTP ${response.status}` };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
    }
  }

  async complete(options: CompletionOptions): Promise<CompletionResponse> {
    const request = this.buildRequest(options, false);
    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
      signal: options.signal,
    });

    if (!response.ok) {
      const error: any = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data: AnthropicResponse = (await response.json()) as any;
    return this.parseResponse(data);
  }

  async streamComplete(options: CompletionOptions, callbacks: StreamCallbacks): Promise<void> {
    const request = this.buildRequest(options, true);
    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
      signal: options.signal,
    });

    if (!response.ok) {
      const error: any = await response.json();
      callbacks.onError?.(new Error(`Anthropic API error: ${error.error?.message || response.statusText}`));
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError?.(new Error('No response body'));
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let currentToolCall: Partial<ToolCall> | null = null;
    let toolCallBuffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') continue;

          try {
            const event: AnthropicStreamEvent = JSON.parse(jsonStr);
            this.handleStreamEvent(event, callbacks, currentToolCall, toolCallBuffer);
          } catch (e) {
            // Ignore parse errors
          }
        }
      }

      // Process remaining buffer
      if (buffer.startsWith('data: ')) {
        const jsonStr = buffer.slice(6);
        if (jsonStr !== '[DONE]') {
          try {
            const event: AnthropicStreamEvent = JSON.parse(jsonStr);
            this.handleStreamEvent(event, callbacks, currentToolCall, toolCallBuffer);
          } catch {}
        }
      }

      callbacks.onDone?.();
    } catch (error) {
      callbacks.onError?.(error instanceof Error ? error : new Error('Stream error'));
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.config.apiKey || '',
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'messages-2023-12-15',
      ...this.config.customHeaders,
    };
  }

  private buildRequest(options: CompletionOptions, stream: boolean): AnthropicRequest {
    const { model, messages, systemPrompt, temperature, maxTokens, tools, toolChoice, reasoningEffort } = options;

    const request: AnthropicRequest = {
      model,
      messages: this.formatMessagesForAnthropic(messages),
      max_tokens: maxTokens || 4096,
      stream,
    };

    if (systemPrompt) {
      request.system = systemPrompt;
    }

    if (temperature !== undefined) {
      request.temperature = temperature;
    }

    if (tools && tools.length > 0) {
      request.tools = tools.map(t => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      }));
    }

    if (toolChoice) {
      if (toolChoice === 'auto' || toolChoice === 'none') {
        request.tool_choice = { type: toolChoice === 'none' ? 'auto' : toolChoice } as any;
      } else if (toolChoice === 'required') {
        request.tool_choice = { type: 'any' };
      } else if (toolChoice.type === 'function') {
        request.tool_choice = { type: 'tool', name: toolChoice.name };
      }
    }

    if (reasoningEffort) {
      const budgetMap = { low: 1024, medium: 4096, high: 16384 };
      request.thinking = { type: 'enabled', budget_tokens: budgetMap[reasoningEffort] };
    }

    return request;
  }

  private formatMessagesForAnthropic(messages: CompletionOptions['messages']): AnthropicMessage[] {
    return (messages as any[]).map(msg => {
      if (typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }

      return {
        role: msg.role,
        content: msg.content.map((part: any) => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text || '' };
          }
          if (part.type === 'image' && part.imageUrl) {
            const match = part.imageUrl.match(/^data:(.+);base64,(.+)$/);
            if (match) {
              return {
                type: 'image',
                source: { type: 'base64', media_type: match[1], data: match[2] },
              };
            }
          }
          if (part.type === 'file' && part.fileData) {
            const fd = part.fileData;
            if (fd.mimeType?.startsWith('image/') && fd.base64) {
              return {
                type: 'image',
                source: { type: 'base64', media_type: fd.mimeType, data: fd.base64 },
              };
            }
            if (fd.mimeType === 'application/pdf' && fd.base64) {
              return {
                type: 'document',
                source: { type: 'base64', media_type: 'application/pdf', data: fd.base64 },
              } as any;
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
      };
    });
  }

  private handleStreamEvent(
    event: AnthropicStreamEvent,
    callbacks: StreamCallbacks,
    currentToolCall: Partial<ToolCall> | null,
    toolCallBuffer: string
  ): void {
    switch (event.type) {
      case 'content_block_start': {
        if (event.delta?.type === 'tool_use_delta' || (event as any).content_block?.type === 'tool_use') {
          const block = (event as any).content_block;
          currentToolCall = {
            id: block.id,
            name: block.name,
            arguments: {},
          };
          toolCallBuffer = '';
        }
        break;
      }

      case 'content_block_delta': {
        if (event.delta?.type === 'text_delta' && event.delta.text) {
          callbacks.onContent?.(event.delta.text);
        } else if (event.delta?.type === 'tool_use_delta' && event.delta.partial_json) {
          toolCallBuffer += event.delta.partial_json;
        }
        break;
      }

      case 'content_block_stop': {
        if (currentToolCall) {
          try {
            currentToolCall.arguments = JSON.parse(toolCallBuffer);
            callbacks.onToolCall?.(currentToolCall as ToolCall);
          } catch {}
          currentToolCall = null;
          toolCallBuffer = '';
        }
        break;
      }

      case 'message_delta': {
        if (event.usage) {
          // Could track usage incrementally
        }
        break;
      }

      case 'message_stop': {
        callbacks.onDone?.({
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        });
        break;
      }

      case 'error': {
        callbacks.onError?.(new Error((event as any).error?.message || 'Stream error'));
        break;
      }
    }
  }

  private parseResponse(data: AnthropicResponse): CompletionResponse {
    let content = '';
    const toolCalls: ToolCall[] = [];

    for (const block of data.content) {
      if (block.type === 'text') {
        content += block.text;
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          name: block.name,
          arguments: block.input,
        });
      }
    }

    const finishReasonMap: Record<string, CompletionResponse['finishReason']> = {
      end_turn: 'stop',
      max_tokens: 'length',
      tool_use: 'tool_calls',
      stop_sequence: 'stop',
    };

    return {
      content,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      finishReason: finishReasonMap[data.stop_reason] || 'stop',
    };
  }
}

// Register provider
registerProvider('anthropic', AnthropicProvider);