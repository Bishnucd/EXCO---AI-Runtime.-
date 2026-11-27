---
name: memory-leak-heap-dump-inspection
description: Inspects Node.js and JVM heap dumps to isolate memory leaks, retained objects, and unbounded collections. Use when diagnosing creeping memory consumption and OOM crashes in production.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot"
---
# Memory Leak Heap Dump Inspection

## Overview
Memory leaks degrade server performance until out-of-memory (OOM) kills the container. Analyzing V8 or JVM heap snapshots reveals retaining paths holding onto deallocated objects.

## Operational Workflow

1. **Trigger heap snapshot capture via v8.writeHeapSnapshot() or jcmd GC.heap_dump on running server.**:
   - Trigger heap snapshot capture via v8.writeHeapSnapshot() or jcmd GC.heap_dump on running server.

2. **Load .heapsnapshot file into Chrome DevTools Memory Inspector or Eclipse Memory Analyzer (MAT).**:
   - Load .heapsnapshot file into Chrome DevTools Memory Inspector or Eclipse Memory Analyzer (MAT).

3. **Compare snapshots taken before and after sustained traffic to identify growing object classes.**:
   - Compare snapshots taken before and after sustained traffic to identify growing object classes.

4. **Trace retaining paths of leaked objects to identify unremoved event listeners, closures, or static caches.**:
   - Trace retaining paths of leaked objects to identify unremoved event listeners, closures, or static caches.

## Recommended Tools & Environments
- Heap Snapshot
- Chrome DevTools / V8
- Memory Leak Analysis
- Node.js / Java

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
