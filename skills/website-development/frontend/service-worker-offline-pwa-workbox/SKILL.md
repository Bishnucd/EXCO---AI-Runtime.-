---
name: service-worker-offline-pwa-workbox
description: Configures offline Progressive Web App (PWA) asset caching and background sync with Google Workbox. Use when building offline-first web applications that load instantly.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.chrome.com/docs/workbox"
---
# Service Worker Offline Pwa Workbox

## Overview
Workbox simplifies service worker routing and caching strategies (StaleWhileRevalidate, CacheFirst, NetworkFirst), enabling web apps to work reliably without internet connectivity.

## Operational Workflow

1. **Configure Workbox build tool in Vite/Webpack with precacheAndRoute(self.__WB_MANIFEST).**:
   - Configure Workbox build tool in Vite/Webpack with precacheAndRoute(self.__WB_MANIFEST).

2. **Apply CacheFirst strategy with 30-day expiration for immutable static assets (images, fonts).**:
   - Apply CacheFirst strategy with 30-day expiration for immutable static assets (images, fonts).

3. **Apply StaleWhileRevalidate strategy for API data, serving cached content instantly while refreshing in background.**:
   - Apply StaleWhileRevalidate strategy for API data, serving cached content instantly while refreshing in background.

4. **Implement BackgroundSync plugin to queue offline form mutations and replay them when connection restores.**:
   - Implement BackgroundSync plugin to queue offline form mutations and replay them when connection restores.

## Recommended Tools & Environments
- Google Workbox
- Service Worker
- PWA
- Offline Caching

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
