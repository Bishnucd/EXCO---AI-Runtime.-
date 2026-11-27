---
name: deep-linking-universal-links-app-links
description: Configures Apple Universal Links and Android App Links for seamless web-to-app redirection. Use when routing standard HTTPS web links directly into native mobile application views.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/ios/universal-links/"
---
# Deep Linking Universal Links App Links

## Overview
Universal Links ensure standard web URLs (https://example.com/item/123) open directly in native apps rather than web browsers, without clumsy JavaScript redirect prompts or broken links.

## Operational Workflow

1. **Host apple-app-site-association (AASA) JSON file at https**:
   - Host apple-app-site-association (AASA) JSON file at https://domain/.well-known/ without file extension.

2. **Host assetlinks.json containing Android app package and SHA-256 cert fingerprint.**:
   - Host assetlinks.json containing Android app package and SHA-256 cert fingerprint.

3. **Configure associated domains entitlements in Xcode and intent-filters in AndroidManifest.xml.**:
   - Configure associated domains entitlements in Xcode and intent-filters in AndroidManifest.xml.

4. **Implement routing delegate handling inbound URL parameters and navigating to target screens.**:
   - Implement routing delegate handling inbound URL parameters and navigating to target screens.

## Recommended Tools & Environments
- Universal Links
- Android App Links
- apple-app-site-association
- assetlinks.json

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
