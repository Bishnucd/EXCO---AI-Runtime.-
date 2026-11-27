---
name: multi-window-state-persistence
description: Saves and restores multi-window coordinates, maximization states, and monitor bounds across application restarts. Use when providing polished window position memory in desktop applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/mawie81/electron-window-state"
---
# Multi Window State Persistence

## Overview
Desktop apps that reopen in wrong positions or offscreen on disconnected secondary monitors frustrate users. Validating saved bounds against currently active display screens ensures safe recovery.

## Operational Workflow

1. **Capture window bounds (x, y, width, height) and isMaximized state on window resize and move events.**:
   - Capture window bounds (x, y, width, height) and isMaximized state on window resize and move events.

2. **Debounce state updates and save coordinates to local JSON configuration stores.**:
   - Debounce state updates and save coordinates to local JSON configuration stores.

3. **On startup, query system screen displays and verify saved coordinates fall within visible screen boundaries.**:
   - On startup, query system screen displays and verify saved coordinates fall within visible screen boundaries.

4. **Restore window coordinates or fallback to primary display center if previous monitor was disconnected.**:
   - Restore window coordinates or fallback to primary display center if previous monitor was disconnected.

## Recommended Tools & Environments
- Window State Management
- JSON
- Electron / Tauri
- Display API

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
