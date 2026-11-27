---
name: cypress-component-testing-suite
description: Implements isolated frontend UI component tests in real browser environments using Cypress Component Testing. Use when validating complex UI components without launching full backend stacks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.cypress.io/guides/component-testing/overview"
---
# Cypress Component Testing Suite

## Overview
Unit tests with jsdom lack real CSS layout rendering. Cypress Component Testing mounts individual components inside real browser viewports, verifying styling, interactions, and events in isolation.

## Operational Workflow

1. **Configure cypress.config.ts with component testing runner and frontend framework bundler.**:
   - Configure cypress.config.ts with component testing runner and frontend framework bundler.

2. **Mount component instances with mock props, state providers, and mocked API handlers.**:
   - Mount component instances with mock props, state providers, and mocked API handlers.

3. **Simulate user interactions**:
   - Simulate user interactions: typing, clicking, keyboard tab navigation, and focus management.

4. **Assert DOM assertions, accessibility attributes, and emitted callback events.**:
   - Assert DOM assertions, accessibility attributes, and emitted callback events.

## Recommended Tools & Environments
- Cypress
- React / Vue
- TypeScript
- Vite / Webpack

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
