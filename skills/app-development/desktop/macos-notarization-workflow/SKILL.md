---
name: macos-notarization-workflow
description: Automates Apple Developer code signing, hardened runtime configuration, and notarytool submission for macOS apps. Use when preparing macOS desktop applications for Gatekeeper compliance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution"
---
# Macos Notarization Workflow

## Overview
macOS Gatekeeper blocks non-notarized applications. Developers must sign binaries with a Developer ID certificate, enable the hardened runtime, and submit artifacts to Apple Notary Service.

## Operational Workflow

1. **Sign all internal dylibs, frameworks, and executable binaries with developer identity certificates.**:
   - Sign all internal dylibs, frameworks, and executable binaries with developer identity certificates.

2. **Apply hardened runtime flags (--options runtime) with required entitlement XML files.**:
   - Apply hardened runtime flags (--options runtime) with required entitlement XML files.

3. **Submit zipped app bundle to Apple Notary Service using xcrun notarytool with App Store Connect credentials.**:
   - Submit zipped app bundle to Apple Notary Service using xcrun notarytool with App Store Connect credentials.

4. **Staple the returned notarization ticket to the application bundle using xcrun stapler staple.**:
   - Staple the returned notarization ticket to the application bundle using xcrun stapler staple.

## Recommended Tools & Environments
- macOS
- xcrun notarytool
- codesign
- Apple Developer CLI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
