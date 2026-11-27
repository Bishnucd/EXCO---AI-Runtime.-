---
name: webhook-receiver-signature-validator
description: Validates cryptographic HMAC-SHA256 signatures and timestamps on incoming third-party webhooks. Use when securely processing webhooks from Stripe, GitHub, or Shopify.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.stripe.com/webhooks#verify-signatures"
---
# Webhook Receiver Signature Validator

## Overview
Unverified webhook endpoints leave servers vulnerable to forged requests and replay attacks. Computing HMAC-SHA256 signatures over raw request bodies verifies authentic origins.

## Operational Workflow

1. **Capture raw, unparsed request payload buffer before any JSON parsing middleware.**:
   - Capture raw, unparsed request payload buffer before any JSON parsing middleware.

2. **Extract cryptographic signature and timestamp from request headers.**:
   - Extract cryptographic signature and timestamp from request headers.

3. **Verify timestamp freshness (reject requests older than 300 seconds to block replay attacks).**:
   - Verify timestamp freshness (reject requests older than 300 seconds to block replay attacks).

4. **Compute expected HMAC-SHA256 signature using webhook shared secret and compare using crypto.timingSafeEqual.**:
   - Compute expected HMAC-SHA256 signature using webhook shared secret and compare using crypto.timingSafeEqual.

## Recommended Tools & Environments
- HMAC-SHA256
- Node.js / Python
- Webhooks
- Express / FastAPI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
