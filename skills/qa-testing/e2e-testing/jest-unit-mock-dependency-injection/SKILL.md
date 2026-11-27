---
name: jest-unit-mock-dependency-injection
description: Authors fast, isolated unit test suites using Jest with mock implementations and dependency injection. Use when writing reliable unit tests for business logic without touching external services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://jestjs.io/docs/mock-functions"
---
# Jest Unit Mock Dependency Injection

## Overview
Unit tests that call external databases or APIs are slow and flaky. Jest function mocks, module spies, and dependency injection isolate pure domain logic for sub-second test execution.

## Operational Workflow

1. **Structure code using dependency injection interfaces to decouple domain logic from I/O adapters.**:
   - Structure code using dependency injection interfaces to decouple domain logic from I/O adapters.

2. **Mock external service clients and database queries using jest.fn() and jest.spyOn().**:
   - Mock external service clients and database queries using jest.fn() and jest.spyOn().

3. **Assert return values, error boundary throws, and expected call arguments with precision.**:
   - Assert return values, error boundary throws, and expected call arguments with precision.

4. **Enforce strict code coverage thresholds (> 80% branch coverage) in continuous integration.**:
   - Enforce strict code coverage thresholds (> 80% branch coverage) in continuous integration.

## Recommended Tools & Environments
- Jest
- TypeScript
- Node.js
- Dependency Injection

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
