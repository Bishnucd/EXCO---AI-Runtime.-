---
name: refactoring-long-parameter-list-smell
description: Refactors bloated function parameter lists into Parameter Objects and Builder patterns to improve testability. Use when eliminating code smells in legacy codebases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://refactoring.guru/smells/long-parameter-list"
---
# Refactoring Long Parameter List Smell

## Overview
Functions with 6+ parameters are hard to read, prone to argument order bugs, and painful to mock in tests. Bundling related arguments into cohesive parameter objects simplifies signatures.

## Operational Workflow

1. **Identify methods taking 5 or more parameters in code review diffs.**:
   - Identify methods taking 5 or more parameters in code review diffs.

2. **Analyze parameter grouping and encapsulate related fields into a cohesive TypeScript interface or class.**:
   - Analyze parameter grouping and encapsulate related fields into a cohesive TypeScript interface or class.

3. **Refactor function signature to accept the single Parameter Object with sensible defaults.**:
   - Refactor function signature to accept the single Parameter Object with sensible defaults.

4. **Update callers and tests to pass options objects, eliminating positional argument bugs.**:
   - Update callers and tests to pass options objects, eliminating positional argument bugs.

## Recommended Tools & Environments
- Refactoring
- Parameter Objects
- Builder Pattern
- Clean Code

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
