---
name: button-component-state-specification
description: Specifies complete button component lifecycle states (default, hover, focus-visible, active, disabled, loading). Use when designing robust, accessible interactive components.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
---
# Button Component State Specification

## Overview
Incomplete component specifications lead to missing focus rings and jarring hover states. Specifying colors, borders, typography, and accessibility attributes for all 6 states ensures polish.

## Operational Workflow

1. **Specify visual tokens for Default, Hover (+10% lightness or darkness), and Active (pressed scale/shadow) states.**:
   - Specify visual tokens for Default, Hover (+10% lightness or darkness), and Active (pressed scale/shadow) states.

2. **Define high-contrast 2px offset outline for **:
   - Define high-contrast 2px offset outline for :focus-visible to support keyboard navigation.

3. **Specify Disabled state (aria-disabled="true", opacity 0.5, cursor**:
   - Specify Disabled state (aria-disabled="true", opacity 0.5, cursor: not-allowed, pointer-events: none).

4. **Implement Loading state**:
   - Implement Loading state: replace text with animated spinner while maintaining exact button width to prevent layout shifts.

## Recommended Tools & Environments
- Button States
- Focus Visible
- Accessibility (ARIA)
- Component Specification

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
