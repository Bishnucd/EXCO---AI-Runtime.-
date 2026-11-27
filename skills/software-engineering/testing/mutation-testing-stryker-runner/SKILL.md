---
name: mutation-testing-stryker-runner
description: Evaluates test suite effectiveness by injecting deliberate code mutations and checking if test suites detect them. Use when validating that high code coverage actually catches real bugs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://stryker-mutator.io/"
---
# Mutation Testing Stryker Runner

## Overview
100% line coverage means nothing if assertions are weak or missing. Mutation testing mutates code (+ to -, > to <) and measures the percentage of mutations caught ("killed") by tests.

## Operational Workflow

1. **Configure stryker.config.json targeting core domain logic and existing test suites.**:
   - Configure stryker.config.json targeting core domain logic and existing test suites.

2. **Execute Stryker runner to inject syntactical mutations into source files.**:
   - Execute Stryker runner to inject syntactical mutations into source files.

3. **Run test suites against each mutant to verify whether at least one test assertion fails.**:
   - Run test suites against each mutant to verify whether at least one test assertion fails.

4. **Calculate Mutation Score = (killed mutants / total mutants) * 100 and fix surviving mutant gaps.**:
   - Calculate Mutation Score = (killed mutants / total mutants) * 100 and fix surviving mutant gaps.

## Recommended Tools & Environments
- Stryker Mutator
- TypeScript / JavaScript
- Jest
- Mutation Score

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
