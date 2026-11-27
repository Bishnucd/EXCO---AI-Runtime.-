---
name: accessible-modal-dialog-focus-trap
description: Specifies accessible modal dialog behaviors with keyboard focus traps (Tab/Shift-Tab) and Escape dismissal. Use when implementing accessible overlay components conforming to WAI-ARIA.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
---
# Accessible Modal Dialog Focus Trap

## Overview
Inaccessible modals let keyboard focus escape behind the overlay into the inactive page. WAI-ARIA modal patterns require trapping focus within the dialog and restoring focus to the trigger on close.

## Operational Workflow

1. **Add role="dialog", aria-modal="true", and aria-labelledby="modal-title" to modal container.**:
   - Add role="dialog", aria-modal="true", and aria-labelledby="modal-title" to modal container.

2. **Upon opening, save document.activeElement and programmatically shift focus to the first focusable element.**:
   - Upon opening, save document.activeElement and programmatically shift focus to the first focusable element.

3. **Intercept Tab and Shift-Tab keypresses to cycle focus exclusively between modal internal focusable elements.**:
   - Intercept Tab and Shift-Tab keypresses to cycle focus exclusively between modal internal focusable elements.

4. **Listen for Escape keypress or backdrop click to close modal and return focus to the original trigger button.**:
   - Listen for Escape keypress or backdrop click to close modal and return focus to the original trigger button.

## Recommended Tools & Environments
- Modal Dialog
- Focus Trap
- WAI-ARIA Pattern
- Keyboard Navigation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
