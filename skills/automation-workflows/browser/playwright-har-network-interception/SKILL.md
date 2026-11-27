---
name: playwright-har-network-interception
description: Captures, analyzes, and mocks HTTP network requests and responses in Playwright using HAR files. Use when debugging network waterfalls or simulating backend API responses.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/network"
---
# Playwright Har Network Interception

## Overview
Automated browser tests often fail due to flaky third-party APIs. Playwright HAR recording captures live network traffic and replays it offline for fast, deterministic test runs.

## Operational Workflow

1. **Initialize browser context with recordHar**:
   - Initialize browser context with recordHar: { path: "network.har", mode: "full" } enabled.

2. **Execute user flows while logging all network requests, responses, headers, and timings.**:
   - Execute user flows while logging all network requests, responses, headers, and timings.

3. **Configure page.routeFromHAR() to mock downstream API calls using recorded traffic.**:
   - Configure page.routeFromHAR() to mock downstream API calls using recorded traffic.

4. **Analyze HAR performance waterfalls to spot slow resource assets and blocking scripts.**:
   - Analyze HAR performance waterfalls to spot slow resource assets and blocking scripts.

## Recommended Tools & Environments
- Playwright
- HAR (HTTP Archive)
- TypeScript
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
