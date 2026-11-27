---
name: concurrency-race-condition-review
description: Audits multi-threaded and asynchronous code for data races, deadlocks, and atomicity violations. Use when reviewing concurrent Go routines, async Node.js, or multi-threaded Java applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://go.dev/doc/articles/race_detector"
---
# Concurrency Race Condition Review

## Overview
Concurrency bugs are notoriously difficult to reproduce in production. Code reviews must inspect shared mutable state, mutex acquisition order, atomic variables, and channel ownership.

## Operational Workflow

1. **Audit all shared mutable variables accessed across concurrent threads or asynchronous tasks.**:
   - Audit all shared mutable variables accessed across concurrent threads or asynchronous tasks.

2. **Verify that data mutations are guarded by appropriate synchronization primitives (Mutex, RWLock, Atomic).**:
   - Verify that data mutations are guarded by appropriate synchronization primitives (Mutex, RWLock, Atomic).

3. **Check lock acquisition ordering across nested call stacks to identify potential deadlocks.**:
   - Check lock acquisition ordering across nested call stacks to identify potential deadlocks.

4. **Execute automated test suites with thread sanitizers enabled (e.g. go test -race).**:
   - Execute automated test suites with thread sanitizers enabled (e.g. go test -race).

## Recommended Tools & Environments
- Go Race Detector
- ThreadSanitizer
- Mutex / Atomics
- Static Analysis

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
