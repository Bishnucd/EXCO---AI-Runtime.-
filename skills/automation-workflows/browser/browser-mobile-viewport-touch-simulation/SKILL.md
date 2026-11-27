---
name: browser-mobile-viewport-touch-simulation
description: Emulates mobile screen viewports, device pixel ratios, and touch events in Chromium. Use when testing mobile web layouts, responsive menus, and pinch-to-zoom interactions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/emulation#devices"
---
# Browser Mobile Viewport Touch Simulation

## Overview
Desktop mouse clicks do not trigger touchstart and touchend handlers. Configuring mobile device profiles (e.g. iPhone 14) emulates high-DPI viewports and real multi-touch gestures.

## Operational Workflow

1. **Load pre-defined device descriptor from playwright.devices["iPhone 14"].**:
   - Load pre-defined device descriptor from playwright.devices["iPhone 14"].

2. **Initialize browser context with mobile viewport dimensions, hasTouch**:
   - Initialize browser context with mobile viewport dimensions, hasTouch: true, and deviceScaleFactor: 3.

3. **Simulate mobile tap, swipe, and drag gestures using page.touchscreen actions.**:
   - Simulate mobile tap, swipe, and drag gestures using page.touchscreen actions.

4. **Assert that hamburger navigation menus and mobile drawer components operate cleanly.**:
   - Assert that hamburger navigation menus and mobile drawer components operate cleanly.

## Recommended Tools & Environments
- Playwright
- Touch Emulation
- Mobile Viewports
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
