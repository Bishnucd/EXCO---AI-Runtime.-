---
name: exception-handling-boundary-audit
description: Audits exception handling boundaries to eliminate silent catch blocks and unhandled promise rejections. Use when ensuring system observability and fault tolerance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Exception_handling"
---
# Exception Handling Boundary Audit

## Overview
Empty catch blocks ("pokemon exception handling") swallow errors, leaving systems in corrupt states with zero log traces. Proper exception auditing ensures errors are logged, metric-tracked, or re-thrown.

## Operational Workflow

1. **Scan diff for generic catch-all blocks (catch (Exception e) {}) that fail to log or rethrow.**:
   - Scan diff for generic catch-all blocks (catch (Exception e) {}) that fail to log or rethrow.

2. **Verify that caught exceptions preserve the original root cause stack trace when wrapping in domain exceptions.**:
   - Verify that caught exceptions preserve the original root cause stack trace when wrapping in domain exceptions.

3. **Ensure top-level global error handlers capture unhandled promise rejections and log structured JSON errors.**:
   - Ensure top-level global error handlers capture unhandled promise rejections and log structured JSON errors.

4. **Validate that cleanup logic (closing file descriptors, releasing locks) is guaranteed via finally or defer blocks.**:
   - Validate that cleanup logic (closing file descriptors, releasing locks) is guaranteed via finally or defer blocks.

## Recommended Tools & Environments
- Exception Handling
- Error Boundaries
- Observability
- Clean Code

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
