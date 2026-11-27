---
name: service-worker-cache-inspection
description: Inspects and clears Progressive Web App (PWA) Service Workers and CacheStorage caches in headless browsers. Use when testing offline PWA functionality and cache invalidation policies.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"
---
# Service Worker Cache Inspection

## Overview
Progressive Web Apps cache assets aggressively. Inspecting Service Worker registration status and CacheStorage entries ensures users receive updated assets upon deployment.

## Operational Workflow

1. **Navigate to PWA web application and await navigator.serviceWorker.ready promise.**:
   - Navigate to PWA web application and await navigator.serviceWorker.ready promise.

2. **Inspect registered CacheStorage caches and verify that static assets are stored.**:
   - Inspect registered CacheStorage caches and verify that static assets are stored.

3. **Simulate offline mode using context.setOffline(true) and assert app shell renders.**:
   - Simulate offline mode using context.setOffline(true) and assert app shell renders.

4. **Clear caches and unregister service workers to test clean first-time visitor experiences.**:
   - Clear caches and unregister service workers to test clean first-time visitor experiences.

## Recommended Tools & Environments
- Service Workers
- CacheStorage
- Playwright
- PWA

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
