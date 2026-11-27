---
name: button-component-specification
description: Specifies comprehensive interaction states, variants, and keyboard accessibility for design system button components. Use when designing foundational, accessible UI component specifications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
---
# Button Component Specification

## Overview
Buttons are the primary interactive building blocks of user interfaces. A complete button spec defines visual variants (primary, secondary, destructive), sizes, and all 7 interaction states.

## Operational Workflow

1. **Define visual hierarchy variants**:
   - Define visual hierarchy variants: Primary, Secondary, Outline, Ghost, and Destructive.

2. **Specify all 7 interactive states**:
   - Specify all 7 interactive states: default, hover, active/pressed, focus-visible, loading, disabled, and visited.

3. **Define sizing tokens**:
   - Define sizing tokens: padding, typography, border-radius, and icon spacing across sm, md, and lg sizes.

4. **Specify ARIA attributes (aria-disabled, aria-busy) and keyboard trigger semantics (Enter, Space).**:
   - Specify ARIA attributes (aria-disabled, aria-busy) and keyboard trigger semantics (Enter, Space).

## Recommended Tools & Environments
- Design Systems
- CSS / SCSS
- Figma
- WAI-ARIA

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
