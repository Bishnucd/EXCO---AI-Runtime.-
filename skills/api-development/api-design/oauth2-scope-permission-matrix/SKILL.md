---
name: oauth2-scope-permission-matrix
description: Designs granular OAuth 2.0 resource scopes and role-based access control (RBAC) permission matrices. Use when securing API endpoints with least-privilege token access.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc6749#section-3.3"
---
# Oauth2 Scope Permission Matrix

## Overview
Monolithic API permissions allow compromised tokens to access all data. Granular scopes structured as resource:action (e.g. orders:read, billing:write) restrict tokens to specific capabilities.

## Operational Workflow

1. **Inventory all API operations and group them into logical resource domains.**:
   - Inventory all API operations and group them into logical resource domains.

2. **Define standard read, write, and admin scope strings using colon or dot delimiters.**:
   - Define standard read, write, and admin scope strings using colon or dot delimiters.

3. **Implement route middleware verifying token scope claims against required operation permissions.**:
   - Implement route middleware verifying token scope claims against required operation permissions.

4. **Expose developer authorization consent screens detailing the exact scope capabilities requested.**:
   - Expose developer authorization consent screens detailing the exact scope capabilities requested.

## Recommended Tools & Environments
- OAuth 2.0
- JWT Scopes
- RBAC
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
