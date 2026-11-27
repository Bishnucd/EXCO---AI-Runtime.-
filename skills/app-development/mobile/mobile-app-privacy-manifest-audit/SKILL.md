---
name: mobile-app-privacy-manifest-audit
description: Audits iOS Privacy Manifests (PrivacyInfo.xcprivacy) and Android Data Safety forms for tracking compliance. Use when meeting mandatory Apple and Google privacy disclosure rules.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/documentation/bundleresources/privacy_manifest_files"
---
# Mobile App Privacy Manifest Audit

## Overview
Apple and Google reject apps lacking declared privacy manifests. Identifying required reason APIs (UserDefaults, disk space, file timestamps) and third-party SDK data practices ensures compliance.

## Operational Workflow

1. **Audit codebase and third-party SDKs for Apple "Required Reason APIs" (NSPrivacyAccessedAPITypes).**:
   - Audit codebase and third-party SDKs for Apple "Required Reason APIs" (NSPrivacyAccessedAPITypes).

2. **Create PrivacyInfo.xcprivacy declaring exact legal reason codes for each accessed API.**:
   - Create PrivacyInfo.xcprivacy declaring exact legal reason codes for each accessed API.

3. **Document collected data categories (Contact Info, Identifiers, Diagnostics) and linkage to user identities.**:
   - Document collected data categories (Contact Info, Identifiers, Diagnostics) and linkage to user identities.

4. **Generate privacy report in Xcode organizer and verify alignment with App Store Connect disclosures.**:
   - Generate privacy report in Xcode organizer and verify alignment with App Store Connect disclosures.

## Recommended Tools & Environments
- PrivacyInfo.xcprivacy
- Android Data Safety
- Xcode 15+
- App Store Connect

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
