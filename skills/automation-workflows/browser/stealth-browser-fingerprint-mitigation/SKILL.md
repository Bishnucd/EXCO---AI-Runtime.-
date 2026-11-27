---
name: stealth-browser-fingerprint-mitigation
description: Configures Playwright and Puppeteer browser headers, navigator flags, and viewport states to avoid bot detection. Use when automating legitimate web workflows on sensitive platforms.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth"
---
# Stealth Browser Fingerprint Mitigation

## Overview
Standard automated browsers leak automation indicators (navigator.webdriver, headless user agents, missing WebGL vendor strings). Stealth configurations align browser fingerprints with real human browsers.

## Operational Workflow

1. **Strip navigator.webdriver flag and override permissions API query responses.**:
   - Strip navigator.webdriver flag and override permissions API query responses.

2. **Inject authentic WebGL vendor and renderer strings matching common GPU hardware profiles.**:
   - Inject authentic WebGL vendor and renderer strings matching common GPU hardware profiles.

3. **Configure realistic HTTP headers including Sec-CH-UA and Accept-Language client hints.**:
   - Configure realistic HTTP headers including Sec-CH-UA and Accept-Language client hints.

4. **Introduce humanized mouse trajectories and natural keyboard typing delay intervals.**:
   - Introduce humanized mouse trajectories and natural keyboard typing delay intervals.

## Recommended Tools & Environments
- Playwright
- Puppeteer
- JavaScript
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
