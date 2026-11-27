---
name: dark-mode-color-token-mapping-palette
description: Maps semantic surface, border, and text tokens between light and dark themes to preserve visual depth. Use when implementing polished dark mode support across applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://m3.material.io/styles/color/advanced/dark-theme"
---
# Dark Mode Color Token Mapping Palette

## Overview
Dark mode is not simply inverting colors; black text on white becomes glaring white on pure black. Polished dark themes use elevated grey surfaces (#121212 to #242424) and softened white text (87% opacity).

## Operational Workflow

1. **Define surface elevation tokens**:
   - Define surface elevation tokens: surface-0 (background), surface-1 (cards), surface-2 (dialogs/popovers).

2. **In dark mode, increase surface lightness with elevation instead of casting drop shadows.**:
   - In dark mode, increase surface lightness with elevation instead of casting drop shadows.

3. **Softened text contrast**:
   - Softened text contrast: use rgba(255, 255, 255, 0.87) for primary text to prevent eye fatigue.

4. **Map semantic CSS custom properties so toggling [data-theme="dark"] updates all UI components cleanly.**:
   - Map semantic CSS custom properties so toggling [data-theme="dark"] updates all UI components cleanly.

## Recommended Tools & Environments
- Dark Mode
- Semantic Tokens
- Elevation & Surface Layers
- CSS Custom Properties

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
