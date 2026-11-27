---
name: playwright-test-suite
description: Authors resilient end-to-end (E2E) browser test suites with page object models, network mocking, visual regression, and CI execution. Use when writing automated integration and E2E tests for web applications using Playwright.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/intro"
---

# Playwright Test Suite

## Overview
Flaky tests undermine CI/CD velocity and developer confidence. This skill guides the creation of deterministic, resilient end-to-end tests using the Microsoft Playwright framework, enforcing the Page Object Model (POM), accessible locator strategies, and network isolation.

## Operational Workflow

1. **Locator Strategy (Accessibility First)**:
   - Prefer user-facing, accessibility-rooted locators: `page.getByRole('button', { name: 'Submit' })`, `page.getByLabel('Email address')`, `page.getByTestId('checkout-card')`.
   - Avoid brittle CSS or XPath selectors tied to DOM hierarchies (e.g., `div > div:nth-child(2) > input`).

2. **Page Object Model (POM) Structure**:
   - Encapsulate page interactions inside dedicated classes with readable methods (e.g., `loginPage.login(email, password)`, `cartPage.checkout()`).
   - Keep assertions in the test files, not inside page objects, to preserve error stack trace clarity.

3. **Network Interception & State Isolation**:
   - Use `page.route()` to mock third-party API dependencies (Stripe checkout, analytics endpoints) to prevent external flakiness.
   - Utilize browser storage state (`storageState: 'auth.json'`) to bypass repeated UI login flows across test specs.

4. **Deterministic Assertions & Auto-Waiting**:
   - Utilize web-first assertions: `await expect(page.getByText('Order Confirmed')).toBeVisible({ timeout: 5000 })`.
   - Never use arbitrary `page.waitForTimeout()` sleeps; rely on Playwright's built-in auto-waiting on actionability checks (visible, stable, enabled).

5. **CI Reporting & Artifact Capture**:
   - Configure `playwright.config.ts` to capture trace logs, videos, and screenshots on failure (`trace: 'on-first-retry'`).
   - Run tests across Chromium, Firefox, and WebKit engines in parallel.
