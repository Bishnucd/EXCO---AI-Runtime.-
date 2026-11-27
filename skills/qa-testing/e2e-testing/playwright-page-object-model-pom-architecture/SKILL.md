---
name: playwright-page-object-model-pom-architecture
description: Structures maintainable end-to-end test suites using the Page Object Model (POM) pattern in Playwright and TypeScript. Use when eliminating brittle test locators and code duplication.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/pom"
---
# Playwright Page Object Model Pom Architecture

## Overview
Embedding raw CSS selectors directly in test files makes suites brittle to UI redesigns. POM encapsulates page UI elements and user interactions into dedicated, reusable TypeScript classes.

## Operational Workflow

1. **Create Page Object class (e.g., LoginPage, CheckoutPage) taking Playwright Page instance.**:
   - Create Page Object class (e.g., LoginPage, CheckoutPage) taking Playwright Page instance.

2. **Declare element locators using resilient accessibility selectors (getByRole, getByText, getByTestId).**:
   - Declare element locators using resilient accessibility selectors (getByRole, getByText, getByTestId).

3. **Implement high-level user action methods (e.g., loginWithCredentials, completeCheckout).**:
   - Implement high-level user action methods (e.g., loginWithCredentials, completeCheckout).

4. **Author clean, readable test specs that call Page Object methods and assert expected states.**:
   - Author clean, readable test specs that call Page Object methods and assert expected states.

## Recommended Tools & Environments
- Playwright
- TypeScript
- Page Object Model (POM)
- E2E Testing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
