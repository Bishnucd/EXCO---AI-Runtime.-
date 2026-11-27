---
name: browser-iframe-frame-locator-interaction
description: Traverses and interacts with cross-origin embedded iframes using Playwright frameLocator selectors. Use when automating interactions inside Stripe checkout sheets, reCAPTCHAs, and payment forms.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/frames"
---
# Browser Iframe Frame Locator Interaction

## Overview
Embedded payment forms and third-party widgets live inside isolated iframes that normal CSS selectors cannot reach. frameLocator pierces iframe boundaries with auto-waiting and retry safety.

## Operational Workflow

1. **Locate iframe element using page.frameLocator("iframe#checkout").**:
   - Locate iframe element using page.frameLocator("iframe#checkout").

2. **Query child elements inside frame (e.g. frame.locator("input[name=cardNumber]")).**:
   - Query child elements inside frame (e.g. frame.locator("input[name=cardNumber]")).

3. **Fill inputs and trigger clicks while respecting iframe cross-origin security boundaries.**:
   - Fill inputs and trigger clicks while respecting iframe cross-origin security boundaries.

4. **Switch focus cleanly back to top-level page context to complete checkout.**:
   - Switch focus cleanly back to top-level page context to complete checkout.

## Recommended Tools & Environments
- Playwright
- FrameLocator
- DOM
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
