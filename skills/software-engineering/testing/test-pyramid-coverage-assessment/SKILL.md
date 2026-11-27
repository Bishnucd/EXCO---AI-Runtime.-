---
name: test-pyramid-coverage-assessment
description: Audits test suite composition across unit, integration, and end-to-end layers to maintain healthy test pyramid ratios. Use when rebalancing slow, fragile test suites toward fast unit tests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://martinfowler.com/articles/practical-test-pyramid.html"
---
# Test Pyramid Coverage Assessment

## Overview
Over-relying on slow, brittle E2E tests creates frustrating CI bottlenecks. Evaluating the test pyramid ensures 70% unit tests, 20% integration tests, and 10% E2E tests for fast, reliable feedback.

## Operational Workflow

1. **Inventory existing test suites across unit, integration, and E2E test directories.**:
   - Inventory existing test suites across unit, integration, and E2E test directories.

2. **Measure test execution duration, flake rates, and line/branch coverage percentages.**:
   - Measure test execution duration, flake rates, and line/branch coverage percentages.

3. **Identify critical business logic tested only through slow UI tests and push tests down to unit level.**:
   - Identify critical business logic tested only through slow UI tests and push tests down to unit level.

4. **Establish CI test stage budgets**:
   - Establish CI test stage budgets: unit (< 2 mins), integration (< 5 mins), E2E (< 15 mins).

## Recommended Tools & Environments
- Test Pyramid
- Coverage Tools (Istanbul, Coverage.py)
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
