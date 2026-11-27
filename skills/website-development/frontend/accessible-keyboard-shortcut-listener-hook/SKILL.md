---
name: accessible-keyboard-shortcut-listener-hook
description: Implements global keyboard shortcut listeners (Cmd+K command palettes) with input element exclusion. Use when building productivity keyboard shortcuts without interfering with text inputs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent"
---
# Accessible Keyboard Shortcut Listener Hook

## Overview
Global keyboard listeners often trigger accidentally when users type inside form inputs. A custom shortcut hook checks target elements (ignoring input, textarea) and supports modifier key chords.

## Operational Workflow

1. **Author useHotkeys(keyCombo, callback) hook listening to window keydown events.**:
   - Author useHotkeys(keyCombo, callback) hook listening to window keydown events.

2. **Check if document.activeElement is an INPUT, TEXTAREA, or contentEditable element; ignore event if true.**:
   - Check if document.activeElement is an INPUT, TEXTAREA, or contentEditable element; ignore event if true.

3. **Evaluate modifier keys**:
   - Evaluate modifier keys: event.metaKey / event.ctrlKey and matching key letter (e.g., "k").

4. **Prevent default browser action (e.g., prevent browser search bar) and trigger command palette modal.**:
   - Prevent default browser action (e.g., prevent browser search bar) and trigger command palette modal.

## Recommended Tools & Environments
- Keyboard Shortcuts
- React Hooks
- Command Palette (Cmd+K)
- Accessibility

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
