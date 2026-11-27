---
name: radix-ui-accessible-primitive-composition
description: Composes unstyled, accessible UI components (dropdowns, dialogs, tabs) using Radix UI primitives. Use when building bespoke design systems with guaranteed WAI-ARIA compliance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.radix-ui.com/primitives/docs/overview/introduction"
---
# Radix Ui Accessible Primitive Composition

## Overview
Radix UI Primitives handle complex keyboard navigation, focus trapping, screen reader announcements, and portal rendering out of the box, giving developers 100% styling freedom with Tailwind.

## Operational Workflow

1. **Install desired primitive package**:
   - Install desired primitive package: npm install @radix-ui/react-dropdown-menu.

2. **Compose component parts**:
   - Compose component parts: DropdownMenu.Root, DropdownMenu.Trigger, DropdownMenu.Content, DropdownMenu.Item.

3. **Apply custom styling using Tailwind CSS utility classes and data-[state] attribute selectors.**:
   - Apply custom styling using Tailwind CSS utility classes and data-[state] attribute selectors.

4. **Verify keyboard navigation (arrow keys, escape, enter) and screen reader behavior out of the box.**:
   - Verify keyboard navigation (arrow keys, escape, enter) and screen reader behavior out of the box.

## Recommended Tools & Environments
- Radix UI
- Unstyled Primitives
- Accessibility (WAI-ARIA)
- Headless UI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
