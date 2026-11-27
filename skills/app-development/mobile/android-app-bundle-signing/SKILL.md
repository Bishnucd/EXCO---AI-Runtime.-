---
name: android-app-bundle-signing
description: Builds, optimizes, and cryptographically signs Android App Bundles (AAB) for Google Play distribution. Use when preparing Android applications for Play Console release tracks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.android.com/guide/app-bundle"
---
# Android App Bundle Signing

## Overview
Google Play requires Android App Bundles (AAB) for dynamic feature delivery and device-optimized APK generation. Bundles must be compiled via release Gradle tasks and signed with upload keys.

## Operational Workflow

1. **Configure Gradle signingConfigs referencing keystore path, alias, and secure environment credentials.**:
   - Configure Gradle signingConfigs referencing keystore path, alias, and secure environment credentials.

2. **Execute ./gradlew bundleRelease to produce the optimized Android App Bundle.**:
   - Execute ./gradlew bundleRelease to produce the optimized Android App Bundle.

3. **Verify bundle integrity and simulate target APK extractions using Google bundletool.**:
   - Verify bundle integrity and simulate target APK extractions using Google bundletool.

4. **Validate ProGuard/R8 mapping files and symbols for automated crash de-obfuscation.**:
   - Validate ProGuard/R8 mapping files and symbols for automated crash de-obfuscation.

## Recommended Tools & Environments
- Android SDK
- Gradle
- bundletool
- Java Keytool / apksigner

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
