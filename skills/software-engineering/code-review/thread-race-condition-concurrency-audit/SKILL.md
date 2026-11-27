---
name: thread-race-condition-concurrency-audit
description: Audits multithreaded and async code for race conditions, deadlock cycles, and lock-ordering hazards. Use when reviewing concurrent systems and asynchronous backend services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Race_condition"
---
# Thread Race Condition Concurrency Audit

## Overview
Concurrent data access without synchronization causes intermittent, unreproducible bugs. Systematic concurrency audits check shared state mutability, lock ordering, and thread-safety invariants.

## Operational Workflow

1. **Identify all shared mutable state accessible by multiple threads, coroutines, or worker processes.**:
   - Identify all shared mutable state accessible by multiple threads, coroutines, or worker processes.

2. **Verify that all read and write accesses to shared resources are protected by mutexes or atomic primitives.**:
   - Verify that all read and write accesses to shared resources are protected by mutexes or atomic primitives.

3. **Inspect nested lock acquisition chains to verify global, consistent lock acquisition ordering.**:
   - Inspect nested lock acquisition chains to verify global, consistent lock acquisition ordering.

4. **Run ThreadSanitizer (-fsanitize=thread) or Go race detector (go test -race) under concurrent load.**:
   - Run ThreadSanitizer (-fsanitize=thread) or Go race detector (go test -race) under concurrent load.

## Recommended Tools & Environments
- Thread Auditing
- Race Conditions
- Concurrency
- Deadlock Detection

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
