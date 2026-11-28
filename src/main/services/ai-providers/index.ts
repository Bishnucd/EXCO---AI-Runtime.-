/**
 * EXCO AI Providers Index
 * Exports all provider implementations and the registry
 */

export * from './base';
export { AnthropicProvider } from './anthropic';
export { OpenAIProvider } from './openai';
export { GeminiProvider } from './gemini';

// Re-register to ensure they're loaded
import './anthropic';
import './openai';
import './gemini';

import { getRegisteredProviders, createProvider, type BaseAIProvider } from './base';
import { resolveApiKeyProfile } from '@shared/utils';
import type { AIProvider } from '@shared/types';

// Provider manager for the main process
export class ProviderManager {
  private providers: Map<string, BaseAIProvider> = new Map();

  async initializeProviders(providers: AIProvider[]): Promise<void> {
    for (const provider of providers) {
      if (provider.enabled) {
        try {
          const instance = createProvider(provider);
          this.providers.set(provider.id, instance);
        } catch (error) {
          console.error(`Failed to initialize provider ${provider.id}:`, error);
        }
      }
    }
  }

  registerConfiguredProvider(provider: AIProvider): void {
    this.providers.delete(provider.id);
    if (!provider.enabled) return;
    try {
      const instance = createProvider(provider);
      this.providers.set(provider.id, instance);
    } catch (error) {
      console.error(`Failed to register provider ${provider.id}:`, error);
    }
  }

  unregisterProvider(providerId: string): void {
    this.providers.delete(providerId);
  }

  getConfiguredProviderByType(type: string): BaseAIProvider | undefined {
    for (const p of this.providers.values()) {
      if (p.getType() === type) return p;
    }
    return undefined;
  }

  getProviderForKeyProfile(providerType: string, keySecret?: string, keyName?: string): BaseAIProvider | undefined {
    if (keyName) {
      const targetName = keyName.trim().toLowerCase();
      for (const p of this.providers.values()) {
        if (p.getName().trim().toLowerCase() === targetName) {
          return p;
        }
      }
    }
    if (keySecret) {
      const profile = resolveApiKeyProfile(keySecret, providerType, keyName);
      const targetBase = profile.baseUrl.trim().replace(/\/+$/, '').toLowerCase();
      if (targetBase) {
        for (const p of this.providers.values()) {
          const pBase = (p.getProvider().config?.baseUrl || '').trim().replace(/\/+$/, '').toLowerCase();
          if (pBase && pBase === targetBase) {
            return p;
          }
        }
      }
      if (profile.displayName && profile.displayName !== 'Custom API') {
        for (const p of this.providers.values()) {
          if (p.getName().toLowerCase() === profile.displayName.toLowerCase()) {
            return p;
          }
        }
      }
    }
    if (providerType === 'custom' && keyName) {
      // Never leak an unrelated custom endpoint (e.g. "run crate") to another custom key
      return this.getProvider('custom');
    }
    return this.getConfiguredProviderByType(providerType) || this.getProvider(providerType);
  }

  getProvider(providerId: string): BaseAIProvider | undefined {
    let p = this.providers.get(providerId);
    if (!p) {
      try {
        const instance = createProvider({
          id: providerId,
          name: providerId,
          type: providerId as any,
          enabled: true,
          config: {},
          models: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        this.providers.set(providerId, instance);
        return instance;
      } catch (e) {
        console.error(`Failed to lazy create provider ${providerId}:`, e);
      }
    }
    return p;
  }

  getAllProviders(): BaseAIProvider[] {
    return Array.from(this.providers.values());
  }

  async complete(providerId: string, options: any): Promise<any> {
    let provider = this.getProvider(providerId);
    if (!provider) {
      // Try fallback to google or first available
      provider = this.getProvider('google') || this.getAllProviders()[0];
    }
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }
    return provider.complete(options);
  }

  async streamComplete(providerId: string, options: any, callbacks: any): Promise<void> {
    let provider = this.getProvider(providerId);
    if (!provider) {
      provider = this.getProvider('google') || this.getAllProviders()[0];
    }
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }
    return provider.streamComplete(options, callbacks);
  }

  getAvailableTypes(): string[] {
    return getRegisteredProviders();
  }
}

// Singleton instance
export const providerManager = new ProviderManager();
