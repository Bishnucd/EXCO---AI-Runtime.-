---
name: ios-keychain-secure-token-storage
description: Stores and retrieves sensitive credentials using the iOS Keychain Services API with accessibility constraints. Use when safeguarding passwords and tokens across app re-installs on iOS.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/documentation/security/keychain_services"
---
# Ios Keychain Secure Token Storage

## Overview
UserDefaults is stored as plaintext XML on disk. iOS Keychain provides hardware-encrypted, access-controlled key-value storage that persists safely across application updates and re-installs.

## Operational Workflow

1. **Construct SecItemAdd query dictionary specifying class (kSecClassGenericPassword) and account.**:
   - Construct SecItemAdd query dictionary specifying class (kSecClassGenericPassword) and account.

2. **Configure accessibility attribute (kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly).**:
   - Configure accessibility attribute (kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly).

3. **Execute SecItemCopyMatching to retrieve stored secret credentials into secure memory.**:
   - Execute SecItemCopyMatching to retrieve stored secret credentials into secure memory.

4. **Update or delete credentials safely using SecItemUpdate and SecItemDelete operations.**:
   - Update or delete credentials safely using SecItemUpdate and SecItemDelete operations.

## Recommended Tools & Environments
- iOS Keychain Services
- SecItem API
- Swift
- Secure Enclave

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
