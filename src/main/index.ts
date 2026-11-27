/**
 * EXCO Main Process Exports
 * Central exports for main process modules
 */

export * from './database';
export * from './ipc/handlers';
export {
  encrypt,
  decrypt,
  storeApiKey,
  storeSecret,
  getSecret,
  deleteSecret,
  initializeVault,
  getVaultStatus,
  resetVault,
} from './services/credential-vault';
export {
  BaseAIProvider,
  ProviderManager,
  providerManager,
  AnthropicProvider,
  OpenAIProvider,
  registerProvider,
  getProviderConstructor,
  getRegisteredProviders,
} from './services/ai-providers';
export * from './services/mcp/client';
export {
  initializeGovernanceWatcher,
  readGovernanceFile,
  writeGovernanceFile,
  stopGovernanceWatcher,
  getActiveWorkspacePath,
  setActiveWorkspacePath,
} from './services/governance';
export * from './main';