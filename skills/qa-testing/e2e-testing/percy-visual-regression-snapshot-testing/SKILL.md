---
name: percy-visual-regression-snapshot-testing
description: Captures DOM snapshots across responsive viewports and detects pixel differences using Percy visual testing. Use when catching unintended CSS layout breaks and visual styling regressions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.percy.io/"
---
# Percy Visual Regression Snapshot Testing

## Overview
Unit tests miss broken CSS layouts. Percy captures the raw DOM and asset state during test runs, rendering identical pages in the cloud across multiple browsers and viewports to highlight pixel changes.

## Operational Workflow

1. **Integrate @percy/playwright or @percy/cypress into existing test suite.**:
   - Integrate @percy/playwright or @percy/cypress into existing test suite.

2. **Call await percySnapshot(page, "Homepage Hero Section") at critical application states.**:
   - Call await percySnapshot(page, "Homepage Hero Section") at critical application states.

3. **Percy uploads DOM snapshot and renders screenshots in Chrome, Firefox, and Safari across mobile and desktop widths.**:
   - Percy uploads DOM snapshot and renders screenshots in Chrome, Firefox, and Safari across mobile and desktop widths.

4. **Review side-by-side visual diffs in Percy web UI and approve or reject styling modifications.**:
   - Review side-by-side visual diffs in Percy web UI and approve or reject styling modifications.

## Recommended Tools & Environments
- Percy (BrowserStack)
- Visual Regression
- DOM Snapshotting
- CSS Auditing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
