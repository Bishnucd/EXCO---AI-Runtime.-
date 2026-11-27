---
name: headless-session-cookie-persistence
description: Persists and restores browser session cookies, local storage, and authentication states across headless Playwright runs. Use when automating authenticated web application sessions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/auth"
---
# Headless Session Cookie Persistence

## Overview
Authenticating repeatedly during automated scraping or test runs triggers rate limits and CAPTCHAs. Saving authenticated browser storage state allows instances to resume logged-in sessions instantly.

## Operational Workflow

1. **Perform initial interactive authentication and resolve MFA or SSO challenges.**:
   - Perform initial interactive authentication and resolve MFA or SSO challenges.

2. **Export context storage state (cookies, localStorage, session tokens) to encrypted state JSON files.**:
   - Export context storage state (cookies, localStorage, session tokens) to encrypted state JSON files.

3. **Initialize new browser contexts with storageState parameter to bypass login screens.**:
   - Initialize new browser contexts with storageState parameter to bypass login screens.

4. **Implement proactive token expiry detection and automatic session refresh logic.**:
   - Implement proactive token expiry detection and automatic session refresh logic.

## Recommended Tools & Environments
- Playwright
- Node.js
- JSON
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
