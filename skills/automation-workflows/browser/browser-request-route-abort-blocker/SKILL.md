---
name: browser-request-route-abort-blocker
description: Blocks heavy third-party assets (images, fonts, analytics, ads) using route interception to accelerate page loads. Use when scraping text data quickly with minimal bandwidth consumption.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/network#abort-requests"
---
# Browser Request Route Abort Blocker

## Overview
Loading heavy video files, third-party trackers, and web fonts slows down web scraping by 5-10x. Aborting image and media requests at the network layer slashes scraping time and data transfer costs.

## Operational Workflow

1. **Register route interception rule**:
   - Register route interception rule: page.route("**/*", route => ...).

2. **Inspect request resourceType**:
   - Inspect request resourceType: abort requests for image, media, font, and stylesheet types.

3. **Abort known analytics domains (google-analytics.com, segment.io) to avoid contaminating metrics.**:
   - Abort known analytics domains (google-analytics.com, segment.io) to avoid contaminating metrics.

4. **Allow HTML and essential JSON API requests to fulfill normally.**:
   - Allow HTML and essential JSON API requests to fulfill normally.

## Recommended Tools & Environments
- Playwright
- page.route()
- Network Optimization
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
