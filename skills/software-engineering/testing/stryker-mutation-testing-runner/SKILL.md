---
name: stryker-mutation-testing-runner
description: Measures test suite thoroughness by mutating source code syntax trees and asserting mutant kills with Stryker. Use when verifying that test assertions actually catch bugs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://stryker-mutator.io/"
---
# Stryker Mutation Testing Runner

## Overview
Code coverage only proves lines were executed, not that assertions verified correctness. Stryker modifies code (inverts booleans, changes operators) to verify that tests fail and kill mutants.

## Operational Workflow

1. **Configure stryker.config.json specifying test runner (Jest/Vitest) and mutator targets.**:
   - Configure stryker.config.json specifying test runner (Jest/Vitest) and mutator targets.

2. **Execute npx stryker run to systematically generate code mutants in memory.**:
   - Execute npx stryker run to systematically generate code mutants in memory.

3. **Calculate Mutation Score = (Killed Mutants / Total Mutants) * 100.**:
   - Calculate Mutation Score = (Killed Mutants / Total Mutants) * 100.

4. **Inspect surviving mutants to identify weak assertions, missing edge-case tests, or dead code.**:
   - Inspect surviving mutants to identify weak assertions, missing edge-case tests, or dead code.

## Recommended Tools & Environments
- Stryker Mutator
- Mutation Testing
- Test Quality
- JavaScript / TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
