---
name: global-shortcut-keyboard-listener
description: Registers and handles system-wide global keyboard accelerators that work even when the app is unfocused. Use when building desktop productivity tools, screenshot utilities, and hotkey launchers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.electronjs.org/docs/latest/api/global-shortcut"
---
# Global Shortcut Keyboard Listener

## Overview
Launcher and utility apps must respond to global hotkeys (e.g. Cmd+Shift+Space) regardless of which application currently holds user focus, requiring low-level OS hook registrations.

## Operational Workflow

1. **Parse accelerator strings (e.g. CommandOrControl+Shift+Space).**:
   - Parse accelerator strings (e.g. CommandOrControl+Shift+Space).

2. **Register global shortcut hook with the operating system event loop.**:
   - Register global shortcut hook with the operating system event loop.

3. **Handle hotkey activation**:
   - Handle hotkey activation: toggle window visibility, bring window to front, and focus search inputs.

4. **Unregister shortcuts cleanly during application teardown to avoid capturing user keys.**:
   - Unregister shortcuts cleanly during application teardown to avoid capturing user keys.

## Recommended Tools & Environments
- Global Shortcuts API
- X11 / Wayland / Win32 / Cocoa
- Node.js / Rust

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
