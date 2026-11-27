---
name: tooltip-accessibility-keyboard-spec
description: Designs accessible tooltips that support keyboard focus, dismiss on Escape, and avoid covering target elements. Use when providing contextual helper tooltips in web applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"
---
# Tooltip Accessibility Keyboard Spec

## Overview
Tooltips that only show on mouse hover fail keyboard and mobile users. WAI-ARIA tooltips trigger on both :hover and :focus, dismiss on Escape, and do not vanish when the pointer moves onto the tooltip.

## Operational Workflow

1. **Associate trigger element with tooltip using aria-describedby="tooltip-id".**:
   - Associate trigger element with tooltip using aria-describedby="tooltip-id".

2. **Set role="tooltip" on tooltip content container with persistent unique ID.**:
   - Set role="tooltip" on tooltip content container with persistent unique ID.

3. **Show tooltip on trigger mouseenter and focus; hide on mouseleave and blur.**:
   - Show tooltip on trigger mouseenter and focus; hide on mouseleave and blur.

4. **Dismiss tooltip immediately when user presses Escape key without changing keyboard focus position.**:
   - Dismiss tooltip immediately when user presses Escape key without changing keyboard focus position.

## Recommended Tools & Environments
- Tooltip Pattern
- WAI-ARIA APG
- Keyboard Accessibility
- Popper / Floating UI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
