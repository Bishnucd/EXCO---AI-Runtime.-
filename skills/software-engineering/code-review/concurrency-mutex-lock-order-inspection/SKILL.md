---
name: concurrency-mutex-lock-order-inspection
description: Verifies strict lock hierarchy and timeout policies across multi-mutex locks to eliminate deadlocks. Use when reviewing multithreaded systems that acquire multiple locks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Deadlock"
---
# Concurrency Mutex Lock Order Inspection

## Overview
Deadlocks occur when Thread 1 holds Lock A and waits for Lock B, while Thread 2 holds Lock B and waits for Lock A. Enforcing a strict global lock ordering invariant prevents deadlocks mathematically.

## Operational Workflow

1. **Identify all functions that acquire two or more locks simultaneously.**:
   - Identify all functions that acquire two or more locks simultaneously.

2. **Establish a strict, documented lock acquisition order (e.g., always acquire Lock A before Lock B).**:
   - Establish a strict, documented lock acquisition order (e.g., always acquire Lock A before Lock B).

3. **Replace indefinite blocking lock acquisitions with timed try-lock operations to avoid permanent hangs.**:
   - Replace indefinite blocking lock acquisitions with timed try-lock operations to avoid permanent hangs.

4. **Verify that locks are released in the exact reverse order of acquisition within defer or finally blocks.**:
   - Verify that locks are released in the exact reverse order of acquisition within defer or finally blocks.

## Recommended Tools & Environments
- Lock Ordering
- Deadlock Prevention
- Concurrency
- Mutex Synchronization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
