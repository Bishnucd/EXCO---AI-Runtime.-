---
name: idempotent-payment-transaction-coordinator
description: Designs two-phase distributed transactions with idempotency keys and compensating sagas. Use when preventing duplicate charges and handling partial distributed failures.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://stripe.com/docs/api/idempotent_requests"
---
# Idempotent Payment Transaction Coordinator

## Overview
Network retries can charge a customer twice. Idempotency middleware caches the initial response for a unique Idempotency-Key header, returning identical results on duplicate retries without re-charging.

## Operational Workflow

1. **Require client to submit Idempotency-Key**:
   - Require client to submit Idempotency-Key: <uuid> header on all mutating payment requests.

2. **Acquire atomic lock on idempotency key in Redis or database table to prevent concurrent in-flight retries.**:
   - Acquire atomic lock on idempotency key in Redis or database table to prevent concurrent in-flight retries.

3. **If key exists and is completed, return cached response payload immediately.**:
   - If key exists and is completed, return cached response payload immediately.

4. **If key is new, execute charge transaction, store final response in idempotency cache, and release lock.**:
   - If key is new, execute charge transaction, store final response in idempotency cache, and release lock.

## Recommended Tools & Environments
- Idempotency Keys
- Saga Pattern
- Distributed Transactions
- Payment Processing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
