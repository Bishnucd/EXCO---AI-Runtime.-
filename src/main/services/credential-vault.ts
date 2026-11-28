/**
 * EXCO Credential Vault
 * Secure credential storage using OS keychain (keytar) with AES-256-GCM fallback
 */

import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { app, safeStorage } from 'electron';

let keytar: any = null;
try {
  keytar = require('keytar');
} catch {
  // keytar not compiled, will use safeStorage / local fallback
}

const SERVICE_NAME = 'EXCO-Credential-Vault';
const VAULT_VERSION = '1';
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32;
const ITERATIONS = 100000;

// ============================================================================
// Fallback Key-Value Store
// ============================================================================

function getFallbackStorePath(): string {
  try {
    const userData = app.getPath('userData');
    return path.join(userData, 'vault.enc');
  } catch {
    return path.join(process.cwd(), 'vault.enc');
  }
}

function loadFallbackStore(): Record<string, string> {
  const filePath = getFallbackStorePath();
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath);
    if (safeStorage && safeStorage.isEncryptionAvailable()) {
      return JSON.parse(safeStorage.decryptString(raw));
    }
    return JSON.parse(raw.toString('utf8'));
  } catch {
    return {};
  }
}

function saveFallbackStore(store: Record<string, string>): void {
  const filePath = getFallbackStorePath();
  if (!safeStorage || !safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure OS keychain and Electron safeStorage are unavailable; refusing to persist unencrypted credentials.');
  }
  try {
    const jsonStr = JSON.stringify(store);
    const encrypted = safeStorage.encryptString(jsonStr);
    fs.writeFileSync(filePath, encrypted);
  } catch (err) {
    console.error('Failed to save fallback store:', err);
    throw err;
  }
}

async function setSecurePassword(service: string, account: string, password: string): Promise<void> {
  if (keytar && typeof keytar.setPassword === 'function') {
    try {
      await keytar.setPassword(service, account, password);
      return;
    } catch {
      // Fallback below
    }
  }
  const store = loadFallbackStore();
  store[`${service}:${account}`] = password;
  saveFallbackStore(store);
}

async function getSecurePassword(service: string, account: string): Promise<string | null> {
  if (keytar && typeof keytar.getPassword === 'function') {
    try {
      const res = await keytar.getPassword(service, account);
      if (res) return res;
    } catch {
      // Fallback below
    }
  }
  const store = loadFallbackStore();
  return store[`${service}:${account}`] ?? null;
}

async function deleteSecurePassword(service: string, account: string): Promise<boolean> {
  let deletedFromKeytar = false;
  if (keytar && typeof keytar.deletePassword === 'function') {
    try {
      deletedFromKeytar = await keytar.deletePassword(service, account);
    } catch {
      // Fallback cleanup below
    }
  }
  try {
    const store = loadFallbackStore();
    const compositeKey = `${service}:${account}`;
    if (Object.prototype.hasOwnProperty.call(store, compositeKey)) {
      delete store[compositeKey];
      saveFallbackStore(store);
    }
  } catch {
    // Do not block key deletion if OS safeStorage fallback cannot be written
  }
  return deletedFromKeytar || true;
}

// ============================================================================
// Master Key Management
// ============================================================================

let masterKey: Buffer | null = null;
let vaultInitialized = false;

async function getOrCreateMasterKey(): Promise<Buffer> {
  if (masterKey) return masterKey;

  const stored = await getSecurePassword(SERVICE_NAME, 'master-key');
  if (stored) {
    masterKey = Buffer.from(stored, 'base64');
    return masterKey;
  }

  masterKey = crypto.randomBytes(KEY_LENGTH);
  await setSecurePassword(SERVICE_NAME, 'master-key', masterKey.toString('base64'));
  return masterKey;
}

export async function initializeVault(): Promise<void> {
  if (vaultInitialized) return;
  await getOrCreateMasterKey();
  vaultInitialized = true;
}

export async function resetVault(): Promise<void> {
  await deleteSecurePassword(SERVICE_NAME, 'master-key');
  masterKey = null;
  vaultInitialized = false;
  await initializeVault();
}

// ============================================================================
// Encryption/Decryption
// ============================================================================

function deriveKey(password: Buffer, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

export interface EncryptedData {
  version: string;
  algorithm: string;
  salt: string;
  iv: string;
  ciphertext: string;
  tag: string;
}

export async function encrypt(plaintext: string): Promise<string> {
  await initializeVault();
  const key = masterKey!;

  const salt = crypto.randomBytes(SALT_LENGTH);
  const derivedKey = deriveKey(key, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const result: EncryptedData = {
    version: VAULT_VERSION,
    algorithm: ALGORITHM,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    tag: tag.toString('base64'),
  };

  return JSON.stringify(result);
}

export async function decrypt(encryptedJson: string): Promise<string> {
  await initializeVault();
  const key = masterKey!;

  let data: EncryptedData;
  try {
    data = JSON.parse(encryptedJson);
  } catch {
    return encryptedJson;
  }

  if (data.version !== VAULT_VERSION || data.algorithm !== ALGORITHM) {
    throw new Error('Unsupported encryption format');
  }

  const salt = Buffer.from(data.salt, 'base64');
  const iv = Buffer.from(data.iv, 'base64');
  const ciphertext = Buffer.from(data.ciphertext, 'base64');
  const tag = Buffer.from(data.tag, 'base64');

  const derivedKey = deriveKey(key, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

// ============================================================================
// High-level API for API Keys
// ============================================================================

const KEY_PREFIX = 'api-key:';

export async function storeApiKey(providerId: string, keyName: string, apiKey: string): Promise<void> {
  const account = `${KEY_PREFIX}${providerId}:${keyName}`;
  await setSecurePassword(SERVICE_NAME, account, apiKey);
}

export async function getApiKey(providerId: string, keyName: string): Promise<string | null> {
  const account = `${KEY_PREFIX}${providerId}:${keyName}`;
  return await getSecurePassword(SERVICE_NAME, account);
}

export async function deleteApiKey(providerId: string, keyName: string): Promise<boolean> {
  const account = `${KEY_PREFIX}${providerId}:${keyName}`;
  return await deleteSecurePassword(SERVICE_NAME, account);
}

export async function listApiKeys(): Promise<{ providerId: string; keyName: string }[]> {
  return [];
}

// ============================================================================
// Generic Secret Storage
// ============================================================================

const SECRET_PREFIX = 'secret:';

export async function storeSecret(name: string, value: string): Promise<void> {
  const account = `${SECRET_PREFIX}${name}`;
  await setSecurePassword(SERVICE_NAME, account, value);
}

export async function getSecret(name: string): Promise<string | null> {
  const account = `${SECRET_PREFIX}${name}`;
  return await getSecurePassword(SERVICE_NAME, account);
}

export async function deleteSecret(name: string): Promise<boolean> {
  const account = `${SECRET_PREFIX}${name}`;
  return await deleteSecurePassword(SERVICE_NAME, account);
}

// ============================================================================
// Vault Status
// ============================================================================

export async function getVaultStatus(): Promise<{ initialized: boolean; backend: 'keytar' | 'fallback' }> {
  try {
    await initializeVault();
    if (keytar && typeof keytar.setPassword === 'function') {
      await keytar.setPassword(SERVICE_NAME, 'test', 'test');
      await keytar.deletePassword(SERVICE_NAME, 'test');
      return { initialized: true, backend: 'keytar' };
    }
    return { initialized: true, backend: 'fallback' };
  } catch {
    return { initialized: true, backend: 'fallback' };
  }
}

// ============================================================================
// Cleanup on App Quit
// ============================================================================

app.on('before-quit', () => {
  if (masterKey) {
    masterKey.fill(0);
    masterKey = null;
  }
  vaultInitialized = false;
});
