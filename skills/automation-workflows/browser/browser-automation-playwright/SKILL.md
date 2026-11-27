---
name: browser-automation-playwright
description: Drives a real browser with Playwright to verify a web flow end to end, using stable locators, deterministic waits, and teardown that leaves no state behind. Use when testing a user journey in a browser, reproducing a UI bug, or automating a repetitive web task that has no API.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Browser Automation with Playwright

Automation that fails for the right reasons. Flaky selectors and sleeps are treated as
defects, not as noise to retry away.

## When to use

- Verifying a user journey in a real browser.
- Reproducing a bug that only appears in the UI.
- Automating a web task with no API, where the user has authorised access.
- Capturing screenshots or console errors for a report.

## Workflow

### 1. Choose the assertion before the selector

Write the user-visible outcome first: "the order total reads £42.00". Then choose the locator
that proves it. Assertions on user-visible text and roles survive refactors; CSS class
selectors do not.

### 2. Prefer accessible locators, in this order

1. `getByRole("button", { name: "Pay now" })`
2. `getByLabel("Email")`, `getByPlaceholder(...)`
3. `getByText(...)` for content
4. `getByTestId(...)` when the UI has no stable accessible name
5. CSS/XPath — last resort, and add a test id instead when possible

### 3. Handle waits deterministically

- Rely on Playwright's auto-waiting assertions: `await expect(locator).toBeVisible()`.
- For network-driven UI, wait on the response or on the resulting DOM state:
  `await page.waitForResponse(r => r.url().includes("/api/cart") && r.ok())`.
- Never use `page.waitForTimeout()`. If a test needs one, the app is missing an observable
  signal; record that as a finding.
- Set a global `expect` timeout and an action timeout; leave retries at 0 locally so flakes
  are visible.

### 4. Manage state

- Create the account or record the test needs, then delete it in `afterEach`/`afterAll`.
- Use a fresh browser context per test; never share cookies between tests.
- For authenticated flows, save storage state once in a setup project, and still assert the
  login works in one test.
- Do not run destructive automation against production. Check the base URL before the first
  action and refuse if it is not a test environment.

### 5. Capture evidence on failure

```js
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== "passed") {
    await page.screenshot({ path: `artifacts/${testInfo.title}.png`, fullPage: true });
    testInfo.attachments.push({
      name: "console",
      body: Buffer.from(JSON.stringify(logs, null, 2)),
      contentType: "application/json",
    });
  }
});
```

Collect console errors and failed network requests in a `page.on` listener from the start.

### 6. Structure the suite

- `playwright.config.ts` with `projects` per browser and a `baseURL` from env.
- `tests/` mirroring user journeys, not source files.
- One `setup` project for auth.
- Trace on first retry: `trace: "on-first-retry"`.

### 7. Diagnose flakes instead of retrying

When a test is flaky, capture: the trace, the failing locator's match count, and the network
waterfall. Usual causes: animation still running, an element matching multiple nodes, a
request resolving after the assertion, or shared state between tests. Fix the cause; do not
raise the timeout.

## Rules

- Never automate a site you do not own or have written permission to test.
- Never store credentials in the test file; use environment variables or a secret store.
- Never disable TLS verification or bypass a CAPTCHA to make a test pass.
- Never leave created records behind.
- Assertions must be about user-visible outcomes, not internal function calls.

## Output format

```
playwright.config.ts
tests/<journey>.spec.ts
tests/setup/auth.setup.ts
artifacts/            (gitignored)
BROWSER_TEST_NOTES.md # journeys covered, environment, known flakes and their cause
```

## Error handling

| Condition | Action |
|-----------|--------|
| Element matches multiple nodes | Tighten the locator with role + name; do not use `.first()` blindly |
| Flow requires MFA | Use a test account with MFA disabled in the test environment, or pause and ask |
| Third-party iframe | Use `frameLocator`; if the provider blocks automation, mark the step manual |
| Test environment is unreachable | Stop and report; do not fall back to production |

## Example

**Input:** checkout flow, staging environment.
**Output:** 4 specs (cart, address, payment, confirmation), role-based locators, a cleanup
fixture that deletes the order, a trace on retry, and one finding that the total is asserted
before the cart request resolves.
