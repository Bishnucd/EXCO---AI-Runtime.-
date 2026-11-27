---
name: axe-playwright-automated-accessibility-scanner
description: Automates WCAG 2.2 Level AA accessibility audits during Playwright end-to-end browser tests using axe-core. Use when preventing color contrast, ARIA, and focus trap accessibility regressions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright"
---
# Axe Playwright Automated Accessibility Scanner

## Overview
Accessibility compliance cannot rely purely on manual audits. axe-core scans live rendered DOM nodes during Playwright tests, detecting missing alt tags, poor color contrast, and invalid ARIA roles.

## Operational Workflow

1. **Import injectAxe and checkA11y from @axe-core/playwright into test spec.**:
   - Import injectAxe and checkA11y from @axe-core/playwright into test spec.

2. **Navigate to application page and inject axe-core rules engine using await injectAxe(page).**:
   - Navigate to application page and inject axe-core rules engine using await injectAxe(page).

3. **Execute await checkA11y(page, undefined, { detailedReport**:
   - Execute await checkA11y(page, undefined, { detailedReport: true, includedImpacts: ["serious", "critical"] }).

4. **Fail test build automatically if any WCAG AA violations are discovered, printing exact remediation guidance.**:
   - Fail test build automatically if any WCAG AA violations are discovered, printing exact remediation guidance.

## Recommended Tools & Environments
- @axe-core/playwright
- Axe-Core
- WCAG 2.2 AA
- Accessibility Testing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
