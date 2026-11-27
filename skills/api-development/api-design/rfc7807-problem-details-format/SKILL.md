---
name: rfc7807-problem-details-format
description: Structures API error responses following RFC 7807 / RFC 9457 Problem Details for HTTP APIs. Use when providing machine-readable, standardized error envelopes across REST services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc9457"
---
# Rfc7807 Problem Details Format

## Overview
Inconsistent error formats confuse API consumers. RFC 9457 defines standard fields (type, title, status, detail, instance) alongside domain-specific extension members for actionable errors.

## Operational Workflow

1. **Set response Content-Type to application/problem+json.**:
   - Set response Content-Type to application/problem+json.

2. **Populate mandatory type URI identifying human-readable documentation for the specific error class.**:
   - Populate mandatory type URI identifying human-readable documentation for the specific error class.

3. **Include title, status code matching HTTP status, human detail, and unique instance URI.**:
   - Include title, status code matching HTTP status, human detail, and unique instance URI.

4. **Attach structured invalid-params array detailing field-level validation errors.**:
   - Attach structured invalid-params array detailing field-level validation errors.

## Recommended Tools & Environments
- RFC 9457
- JSON
- HTTP Status Codes
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
