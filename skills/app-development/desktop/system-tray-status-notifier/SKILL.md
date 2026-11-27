---
name: system-tray-status-notifier
description: Manages system tray / menu bar status icons, dynamic context menus, and background minimize behavior. Use when building background utility applications that live in the OS tray.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.electronjs.org/docs/latest/api/tray"
---
# System Tray Status Notifier

## Overview
Background utilities (sync clients, VPNs, chat apps) require unobtrusive system tray icons with dynamic status badges, right-click context menus, and single-click window toggling.

## Operational Workflow

1. **Initialize OS tray icon using high-DPI templates (.ico on Windows, template PNG on macOS).**:
   - Initialize OS tray icon using high-DPI templates (.ico on Windows, template PNG on macOS).

2. **Construct context menu hierarchy with action items, checkable toggles, and quit handlers.**:
   - Construct context menu hierarchy with action items, checkable toggles, and quit handlers.

3. **Implement window minimize-to-tray and close-to-tray intercept event handlers.**:
   - Implement window minimize-to-tray and close-to-tray intercept event handlers.

4. **Update tray icon status badges dynamically to reflect background synchronization progress.**:
   - Update tray icon status badges dynamically to reflect background synchronization progress.

## Recommended Tools & Environments
- Electron / Tauri
- System Tray API
- Desktop Menus
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
