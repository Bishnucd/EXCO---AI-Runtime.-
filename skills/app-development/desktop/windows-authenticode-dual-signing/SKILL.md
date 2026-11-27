---
name: windows-authenticode-dual-signing
description: Signs Windows executables and DLLs with SHA-256 Authenticode digital certificates using SignTool and timestamp servers. Use when eliminating Windows SmartScreen untrusted warnings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://learn.microsoft.com/en-us/windows-hardware/drivers/install/authenticode"
---
# Windows Authenticode Dual Signing

## Overview
Windows SmartScreen blocks unsigned binaries with severe warning screens. Signing executables with EV or standard code signing certificates and trusted RFC 3161 timestamps ensures trust.

## Operational Workflow

1. **Acquire code signing certificate backed by Cloud HSM or physical YubiKey token.**:
   - Acquire code signing certificate backed by Cloud HSM or physical YubiKey token.

2. **Execute signtool sign with /fd sha256 hashing algorithm.**:
   - Execute signtool sign with /fd sha256 hashing algorithm.

3. **Attach RFC 3161 cryptographic timestamp (/tr http**:
   - Attach RFC 3161 cryptographic timestamp (/tr http://timestamp.digicert.com /td sha256) ensuring validity after cert expiration.

4. **Verify signature validity and root authority trust chains using signtool verify /pa /v.**:
   - Verify signature validity and root authority trust chains using signtool verify /pa /v.

## Recommended Tools & Environments
- SignTool
- Authenticode
- Hardware Security Module (HSM)
- Windows

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
