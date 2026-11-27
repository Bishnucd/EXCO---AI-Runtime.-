---
name: desktop-deep-linking-custom-protocol
description: Registers custom URI schemes (e.g. myapp://auth/callback) to handle deep links and web-to-desktop authentication. Use when completing OAuth redirects and web links in desktop apps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app"
---
# Desktop Deep Linking Custom Protocol

## Overview
Web browsers complete OAuth logins by redirecting to custom URI schemes. Registering protocols with the OS ensures clicks on web links launch or focus the desktop application.

## Operational Workflow

1. **Register custom protocol in application manifest (Info.plist CFBundleURLTypes or Windows Registry HKCU\Software\Classes).**:
   - Register custom protocol in application manifest (Info.plist CFBundleURLTypes or Windows Registry HKCU\Software\Classes).

2. **Implement second-instance lock to pass inbound URL arguments to the running process rather than launching duplicates.**:
   - Implement second-instance lock to pass inbound URL arguments to the running process rather than launching duplicates.

3. **Parse inbound URL query parameters, authorization tokens, and route paths.**:
   - Parse inbound URL query parameters, authorization tokens, and route paths.

4. **Dispatch navigational events to the frontend UI to display requested views.**:
   - Dispatch navigational events to the frontend UI to display requested views.

## Recommended Tools & Environments
- Custom Protocols
- Registry (Windows)
- plist (macOS)
- Desktop Entries (Linux)

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
