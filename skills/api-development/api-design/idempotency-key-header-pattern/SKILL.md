---
name: idempotency-key-header-pattern
description: Implements safe HTTP mutation retries using Idempotency-Key headers backed by Redis transaction locks. Use when preventing duplicate charges or duplicate resource creations in APIs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-03"
---
# Idempotency Key Header Pattern

## Overview
Network drops during POST requests cause clients to retry, risking duplicate payments or records. Idempotency keys allow clients to pass unique UUIDs that servers cache alongside original responses.

## Operational Workflow

1. **Extract Idempotency-Key header on incoming POST, PUT, and PATCH requests.**:
   - Extract Idempotency-Key header on incoming POST, PUT, and PATCH requests.

2. **Attempt atomic Redis SET with NX and EX to lock the key for 120 seconds.**:
   - Attempt atomic Redis SET with NX and EX to lock the key for 120 seconds.

3. **If key exists and execution is complete, return cached response status and payload immediately.**:
   - If key exists and execution is complete, return cached response status and payload immediately.

4. **If key is locked by an in-flight request, return HTTP 409 Conflict with Retry-After header.**:
   - If key is locked by an in-flight request, return HTTP 409 Conflict with Retry-After header.

## Recommended Tools & Environments
- IETF Draft
- Redis
- Node.js / Go
- HTTP Headers

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
