---
name: circuit-breaker-pattern-resilience
description: Implements the circuit breaker pattern with closed, open, and half-open states to prevent cascading failures. Use when wrapping external microservice and third-party API dependencies.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://martinfowler.com/bliki/CircuitBreaker.html"
---
# Circuit Breaker Pattern Resilience

## Overview
When downstream services slow down or crash, upstream callers exhaust threads waiting for timeouts. Circuit breakers trip automatically to fail fast, shielding the system until health returns.

## Operational Workflow

1. **Monitor invocation failure rates over rolling statistical sliding windows.**:
   - Monitor invocation failure rates over rolling statistical sliding windows.

2. **Transition from CLOSED to OPEN state when error percentage exceeds configured threshold (e.g. 50%).**:
   - Transition from CLOSED to OPEN state when error percentage exceeds configured threshold (e.g. 50%).

3. **In OPEN state, fail calls immediately with fallback responses without touching the downstream service.**:
   - In OPEN state, fail calls immediately with fallback responses without touching the downstream service.

4. **Enter HALF-OPEN state after reset timeout, allowing a test probe request to check downstream recovery.**:
   - Enter HALF-OPEN state after reset timeout, allowing a test probe request to check downstream recovery.

## Recommended Tools & Environments
- Resilience4j / Opossum
- Node.js / Java
- Distributed Systems

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
