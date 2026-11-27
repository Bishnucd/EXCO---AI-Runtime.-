---
name: android-keystore-cryptographic-encryption
description: Generates hardware-backed AES/RSA keys and encrypts sensitive application data using Android KeyStore. Use when securing secrets, auth tokens, and sensitive databases on Android.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.android.com/training/articles/keystore"
---
# Android Keystore Cryptographic Encryption

## Overview
Storing plaintext tokens on mobile flash memory invites extraction via rooted devices. The Android KeyStore system stores cryptographic keys inside secure hardware, making extraction impossible.

## Operational Workflow

1. **Generate AES-256 GCM key inside AndroidKeyStore provider specifying purpose and block modes.**:
   - Generate AES-256 GCM key inside AndroidKeyStore provider specifying purpose and block modes.

2. **Encrypt plaintext data using Cipher initialized with hardware key and random IV.**:
   - Encrypt plaintext data using Cipher initialized with hardware key and random IV.

3. **Store combined IV and ciphertext safely in private app storage.**:
   - Store combined IV and ciphertext safely in private app storage.

4. **Decrypt ciphertext on demand by initializing Cipher in DECRYPT_MODE with the stored IV.**:
   - Decrypt ciphertext on demand by initializing Cipher in DECRYPT_MODE with the stored IV.

## Recommended Tools & Environments
- Android KeyStore
- AES-256 GCM
- EncryptedSharedPreferences
- Kotlin

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
