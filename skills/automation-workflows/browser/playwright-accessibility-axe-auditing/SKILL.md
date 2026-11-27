---
name: playwright-accessibility-axe-auditing
description: Executes automated accessibility (a11y) audits on rendered web views using axe-core and Playwright. Use when catching WCAG violations automatically during browser test runs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright"
---
# Playwright Accessibility Axe Auditing

## Overview
Manual accessibility testing is slow. Injecting axe-core into Playwright pages analyzes the live rendered DOM tree, checking ARIA landmarks, contrast, and form labels in milliseconds.

## Operational Workflow

1. **Navigate browser page to target application state and wait for network idle.**:
   - Navigate browser page to target application state and wait for network idle.

2. **Inject AxeBuilder from @axe-core/playwright into page context.**:
   - Inject AxeBuilder from @axe-core/playwright into page context.

3. **Configure scan parameters targeting WCAG 2.2 AA rulesets and excluding third-party iframes.**:
   - Configure scan parameters targeting WCAG 2.2 AA rulesets and excluding third-party iframes.

4. **Assert that results.violations.length === 0, emitting failure summaries for any violations.**:
   - Assert that results.violations.length === 0, emitting failure summaries for any violations.

## Recommended Tools & Environments
- @axe-core/playwright
- Playwright
- WCAG 2.2
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
