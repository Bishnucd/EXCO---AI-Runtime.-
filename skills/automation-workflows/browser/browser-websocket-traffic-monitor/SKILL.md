---
name: browser-websocket-traffic-monitor
description: Intercepts and inspects bidirectional WebSocket frames in headless browser sessions. Use when debugging real-time WebSocket subscriptions and streaming data protocols.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/network#websockets"
---
# Browser Websocket Traffic Monitor

## Overview
Modern single-page applications stream financial tickers and notifications over WebSockets rather than HTTP. Monitoring page.on("websocket") frames exposes real-time message payloads.

## Operational Workflow

1. **Listen for new WebSocket connections using page.on("websocket", ws => ...).**:
   - Listen for new WebSocket connections using page.on("websocket", ws => ...).

2. **Attach frame sent and frame received event listeners to log raw string/binary payloads.**:
   - Attach frame sent and frame received event listeners to log raw string/binary payloads.

3. **Assert that expected subscription messages are transmitted by the client UI upon mount.**:
   - Assert that expected subscription messages are transmitted by the client UI upon mount.

4. **Verify that inbound streaming payloads trigger expected DOM updates in the browser view.**:
   - Verify that inbound streaming payloads trigger expected DOM updates in the browser view.

## Recommended Tools & Environments
- Playwright
- WebSocket Frames
- Node.js
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
