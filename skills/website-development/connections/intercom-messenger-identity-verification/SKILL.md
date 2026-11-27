---
name: intercom-messenger-identity-verification
description: Integrates Intercom Messenger with HMAC-SHA256 user identity verification to prevent impersonation. Use when embedding secure customer support chat into web applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.intercom.com/help/en/articles/183-enable-identity-verification-in-intercom-for-web"
---
# Intercom Messenger Identity Verification

## Overview
Without identity verification, a malicious user could spoof another customer user_id in the Intercom JavaScript snippet. HMAC-SHA256 signing on the backend proves user authenticity.

## Operational Workflow

1. **Enable Identity Verification in Intercom security settings and copy secret identity key.**:
   - Enable Identity Verification in Intercom security settings and copy secret identity key.

2. **Generate HMAC signature on backend**:
   - Generate HMAC signature on backend: crypto.createHmac("sha256", secret).update(user.id).digest("hex").

3. **Pass user_hash and user_id to window.Intercom("boot", { user_id, user_hash, email }) in frontend.**:
   - Pass user_hash and user_id to window.Intercom("boot", { user_id, user_hash, email }) in frontend.

4. **Intercom server verifies cryptographic hash, ensuring conversations remain confidential to the authentic user.**:
   - Intercom server verifies cryptographic hash, ensuring conversations remain confidential to the authentic user.

## Recommended Tools & Environments
- Intercom Messenger
- HMAC-SHA256
- Identity Verification
- Customer Support

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
