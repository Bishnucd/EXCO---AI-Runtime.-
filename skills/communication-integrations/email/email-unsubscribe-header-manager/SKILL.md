---
name: email-unsubscribe-header-manager
description: Implements RFC 8058 one-click List-Unsubscribe headers and automated unsubscribe processing endpoints. Use when complying with CAN-SPAM, GDPR, and modern inbox sender guidelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc8058"
---
# Email Unsubscribe Header Manager

## Overview
Google and Yahoo require one-click List-Unsubscribe headers for bulk senders. Implementing List-Unsubscribe-Post with cryptographic HMAC tokens ensures compliant opt-out flows.

## Operational Workflow

1. **Generate tamper-proof unsubscribe tokens embedding user ID and HMAC signature.**:
   - Generate tamper-proof unsubscribe tokens embedding user ID and HMAC signature.

2. **Inject List-Unsubscribe and List-Unsubscribe-Post**:
   - Inject List-Unsubscribe and List-Unsubscribe-Post: List-Unsubscribe=One-Click headers into email payloads.

3. **Implement POST webhook endpoint receiving unsubscribe requests and updating subscription states within 48h.**:
   - Implement POST webhook endpoint receiving unsubscribe requests and updating subscription states within 48h.

4. **Provide secondary web landing page for granular notification preference management.**:
   - Provide secondary web landing page for granular notification preference management.

## Recommended Tools & Environments
- HTTP / REST
- RFC 8058
- Cryptographic HMAC
- SQL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
