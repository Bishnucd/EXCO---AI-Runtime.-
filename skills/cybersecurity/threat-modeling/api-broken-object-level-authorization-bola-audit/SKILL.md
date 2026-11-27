---
name: api-broken-object-level-authorization-bola-audit
description: Audits API endpoints for Broken Object Level Authorization (BOLA/IDOR) by testing access with cross-tenant IDs. Use when detecting unauthorized data access vulnerabilities in APIs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/"
---
# Api Broken Object Level Authorization Bola Audit

## Overview
BOLA occurs when endpoints accept an ID parameter (e.g. /api/orders/1234) without validating whether the authenticated user owns that record, allowing users to view other tenants' private data.

## Operational Workflow

1. **Create two isolated test user accounts (User A and User B) in separate organization tenants.**:
   - Create two isolated test user accounts (User A and User B) in separate organization tenants.

2. **Record legitimate resource IDs owned exclusively by User A (e.g. invoice_id=1001).**:
   - Record legitimate resource IDs owned exclusively by User A (e.g. invoice_id=1001).

3. **Execute API requests using User B's authorization token while requesting User A's resource IDs.**:
   - Execute API requests using User B's authorization token while requesting User A's resource IDs.

4. **Assert that backend strictly returns HTTP 403 Forbidden or HTTP 404 Not Found.**:
   - Assert that backend strictly returns HTTP 403 Forbidden or HTTP 404 Not Found.

## Recommended Tools & Environments
- OWASP API1:2023
- IDOR Testing
- Burp Suite / Python
- REST

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
