---
name: browser-geolocation-timezone-emulation
description: Emulates device GPS coordinates, locale, timezone, and permissions in headless browser sessions. Use when testing localized web experiences and geofenced features.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/emulation"
---
# Browser Geolocation Timezone Emulation

## Overview
Web applications deliver localized pricing, language, and content based on client coordinates. Headless emulation overrides device latitude, longitude, and timezone offsets deterministically.

## Operational Workflow

1. **Create browser context with geolocation**:
   - Create browser context with geolocation: { latitude: 37.7749, longitude: -122.4194 } (San Francisco).

2. **Grant permissions**:
   - Grant permissions: ["geolocation"] to bypass browser permission prompt dialogs.

3. **Configure locale (e.g. "de-DE") and timezoneId ("Europe/Berlin") settings.**:
   - Configure locale (e.g. "de-DE") and timezoneId ("Europe/Berlin") settings.

4. **Assert that web application renders localized currency (€), dates, and regional content.**:
   - Assert that web application renders localized currency (€), dates, and regional content.

## Recommended Tools & Environments
- Playwright
- Geolocation API
- Timezone Emulation
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
