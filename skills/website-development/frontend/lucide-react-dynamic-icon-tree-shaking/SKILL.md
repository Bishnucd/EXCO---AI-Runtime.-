---
name: lucide-react-dynamic-icon-tree-shaking
description: Integrates dynamic, accessible Lucide React icons with automated tree-shaking and bundle optimization. Use when rendering crisp, consistent vector icons in React applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://lucide.dev/guide/packages/lucide-react"
---
# Lucide React Dynamic Icon Tree Shaking

## Overview
Importing full icon libraries can bloat JavaScript bundles by megabytes. Lucide React provides modular, tree-shakeable SVG icons designed on a 24x24px grid with consistent stroke weights.

## Operational Workflow

1. **Import specific icons directly from lucide-react**:
   - Import specific icons directly from lucide-react: import { Search, ChevronDown, Bell } from "lucide-react".

2. **Pass size, color, and strokeWidth props to match design system tokens.**:
   - Pass size, color, and strokeWidth props to match design system tokens.

3. **Attach aria-hidden="true" to decorative icons and aria-label to interactive icon-only buttons.**:
   - Attach aria-hidden="true" to decorative icons and aria-label to interactive icon-only buttons.

4. **Verify bundle analyzer output to confirm only imported icons are bundled in production.**:
   - Verify bundle analyzer output to confirm only imported icons are bundled in production.

## Recommended Tools & Environments
- Lucide React
- SVG Icons
- Tree-Shaking
- Web Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
