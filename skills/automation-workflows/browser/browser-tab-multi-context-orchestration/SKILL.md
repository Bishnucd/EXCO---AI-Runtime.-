---
name: browser-tab-multi-context-orchestration
description: Orchestrates multiple isolated browser contexts and tabs to simulate multi-user collaboration. Use when testing real-time chat, collaborative docs, and multi-party workflows.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/browser-contexts"
---
# Browser Tab Multi Context Orchestration

## Overview
Testing collaborative software (e.g. Google Docs, multiplayer tools) requires separate authenticated browser instances. Browser contexts provide lightweight incognito profiles within a single browser.

## Operational Workflow

1. **Create two isolated contexts**:
   - Create two isolated contexts: contextAlice and contextBob with separate storage states.

2. **Open corresponding pages navigating to shared collaborative document URL.**:
   - Open corresponding pages navigating to shared collaborative document URL.

3. **Simulate Alice typing text and verify real-time WebSocket propagation to Bob view.**:
   - Simulate Alice typing text and verify real-time WebSocket propagation to Bob view.

4. **Assert Bob DOM reflects Alice edits and verify cursor presence within SLA thresholds.**:
   - Assert Bob DOM reflects Alice edits and verify cursor presence within SLA thresholds.

## Recommended Tools & Environments
- Playwright
- Multi-Context
- WebSockets
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
