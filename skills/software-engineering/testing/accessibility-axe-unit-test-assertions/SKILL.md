---
name: accessibility-axe-unit-test-assertions
description: Asserts WCAG accessibility compliance on isolated React/Vue components in JSDOM using jest-axe. Use when catching accessibility violations early during component unit testing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/nickcolley/jest-axe"
---
# Accessibility Axe Unit Test Assertions

## Overview
Catching accessibility issues in E2E tests is slow. jest-axe brings axe-core rules directly into Jest/Vitest unit tests, asserting that rendered component HTML has zero accessibility violations.

## Operational Workflow

1. **Render UI component into JSDOM using React Testing Library or Vue Test Utils.**:
   - Render UI component into JSDOM using React Testing Library or Vue Test Utils.

2. **Pass rendered container HTML to axe validator**:
   - Pass rendered container HTML to axe validator: const results = await axe(container).

3. **Assert compliance**:
   - Assert compliance: expect(results).toHaveNoViolations().

4. **If violations occur, inspect printed failure details (e.g., missing aria-label or low color contrast) and fix markup.**:
   - If violations occur, inspect printed failure details (e.g., missing aria-label or low color contrast) and fix markup.

## Recommended Tools & Environments
- jest-axe
- Axe-Core
- Unit Testing
- Accessibility

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
