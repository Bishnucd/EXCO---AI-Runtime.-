---
name: browser-screenshot-visual-diff
description: Captures full-page screenshots and detects pixel-level visual regressions across responsive viewport breakpoints. Use when validating UI layouts against unintended visual regressions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/test-snapshots"
---
# Browser Screenshot Visual Diff

## Overview
Visual regression testing catches CSS layout breaks, font clipping, and responsive alignment errors that unit tests miss. Comparing rendered DOM snapshots against baseline images detects changes.

## Operational Workflow

1. **Render pages across standardized viewport dimensions (mobile 375px, tablet 768px, desktop 1280px).**:
   - Render pages across standardized viewport dimensions (mobile 375px, tablet 768px, desktop 1280px).

2. **Mask dynamic elements (timestamps, user avatars, live video) to prevent false positives.**:
   - Mask dynamic elements (timestamps, user avatars, live video) to prevent false positives.

3. **Capture baseline PNG screenshots and execute pixel-by-pixel comparisons using pixelmatch.**:
   - Capture baseline PNG screenshots and execute pixel-by-pixel comparisons using pixelmatch.

4. **Generate visual diff images highlighting altered bounding boxes with configurable threshold sensitivity.**:
   - Generate visual diff images highlighting altered bounding boxes with configurable threshold sensitivity.

## Recommended Tools & Environments
- Playwright
- pixelmatch
- Node.js
- PNG

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
