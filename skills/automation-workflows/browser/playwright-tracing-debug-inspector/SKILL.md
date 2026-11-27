---
name: playwright-tracing-debug-inspector
description: Records comprehensive execution traces with DOM snapshots, console logs, and action filmstrips in Playwright. Use when diagnosing intermittent or flaky test failures in CI.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/trace-viewer"
---
# Playwright Tracing Debug Inspector

## Overview
Flaky test failures on headless CI servers are difficult to debug without visual context. Playwright tracing records live DOM snapshots, mouse clicks, and console logs into a viewable zip archive.

## Operational Workflow

1. **Start tracing in browser context with screenshots**:
   - Start tracing in browser context with screenshots: true and snapshots: true.

2. **Execute user interaction steps within try/finally blocks.**:
   - Execute user interaction steps within try/finally blocks.

3. **Stop tracing and export trace.zip file upon test failure.**:
   - Stop tracing and export trace.zip file upon test failure.

4. **Inspect failed execution step-by-step using the interactive Playwright Trace Viewer UI.**:
   - Inspect failed execution step-by-step using the interactive Playwright Trace Viewer UI.

## Recommended Tools & Environments
- Playwright Trace Viewer
- ZIP Archive
- Chromium
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
