---
name: web-scraping-infinite-scroll-drainer
description: Automates scroll-down interactions and dynamic DOM hydration to scrape infinite scroll feeds reliably. Use when extracting data from social feeds, product catalogs, and image galleries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/evaluating"
---
# Web Scraping Infinite Scroll Drainer

## Overview
Infinite scroll pages load data dynamically upon window scroll events. A robust drainer scrolls smoothly, monitors network and DOM mutation stabilization, and handles bottom-of-feed triggers.

## Operational Workflow

1. **Execute incremental window scroll down operations to trigger viewport intersection observers.**:
   - Execute incremental window scroll down operations to trigger viewport intersection observers.

2. **Wait for network idle or listen for DOM child list mutation events.**:
   - Wait for network idle or listen for DOM child list mutation events.

3. **Extract loaded item records and deduplicate against set of seen entity IDs.**:
   - Extract loaded item records and deduplicate against set of seen entity IDs.

4. **Terminate loop when scroll height stops expanding or maximum record limit is reached.**:
   - Terminate loop when scroll height stops expanding or maximum record limit is reached.

## Recommended Tools & Environments
- Playwright
- DOM MutationObserver
- Node.js
- JavaScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
