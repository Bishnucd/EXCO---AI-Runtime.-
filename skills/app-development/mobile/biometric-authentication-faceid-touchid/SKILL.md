---
name: biometric-authentication-faceid-touchid
description: Integrates Face ID, Touch ID, and Android BiometricPrompt for local device authentication. Use when securing mobile applications with biometric unlock and keychain protection.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.android.com/training/sign-in/biometric-auth"
---
# Biometric Authentication Faceid Touchid

## Overview
Biometrics provide instant, passwordless app access. Modern mobile APIs query biometric hardware availability, prompt users, and unlock cryptographic keys stored in hardware Secure Enclaves.

## Operational Workflow

1. **Check biometric availability (canEvaluatePolicy on iOS, BiometricManager.canAuthenticate on Android).**:
   - Check biometric availability (canEvaluatePolicy on iOS, BiometricManager.canAuthenticate on Android).

2. **Display localized prompt reason (e.g. "Authenticate to view banking account balance").**:
   - Display localized prompt reason (e.g. "Authenticate to view banking account balance").

3. **Handle biometric evaluation responses, fallback password options, and lockout states.**:
   - Handle biometric evaluation responses, fallback password options, and lockout states.

4. **Decrypt sensitive session tokens stored in Keychain / Keystore upon successful biometric match.**:
   - Decrypt sensitive session tokens stored in Keychain / Keystore upon successful biometric match.

## Recommended Tools & Environments
- LocalAuthentication (iOS)
- BiometricPrompt (Android)
- Secure Enclave / Keystore

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
