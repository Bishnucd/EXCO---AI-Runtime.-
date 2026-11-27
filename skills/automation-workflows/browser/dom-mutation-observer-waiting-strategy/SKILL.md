---
name: dom-mutation-observer-waiting-strategy
description: Awaits dynamic DOM changes and attribute modifications using MutationObserver rather than brittle fixed timeouts. Use when testing complex single-page apps with asynchronous animations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver"
---
# Dom Mutation Observer Waiting Strategy

## Overview
Using fixed sleep delays (sleep(5000)) causes slow, flaky tests. Injecting MutationObserver promises awaits exact DOM subtree mutations or attribute changes with millisecond precision.

## Operational Workflow

1. **Define target container DOM element and observation options (childList, attributes, subtree).**:
   - Define target container DOM element and observation options (childList, attributes, subtree).

2. **Create Promise resolving when MutationObserver detects specified target mutation.**:
   - Create Promise resolving when MutationObserver detects specified target mutation.

3. **Trigger asynchronous user action (e.g. filter dropdown selection).**:
   - Trigger asynchronous user action (e.g. filter dropdown selection).

4. **Await mutation promise with safety timeout, proceeding immediately when DOM updates.**:
   - Await mutation promise with safety timeout, proceeding immediately when DOM updates.

## Recommended Tools & Environments
- DOM MutationObserver
- Playwright / Puppeteer
- JavaScript
- Promises

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
