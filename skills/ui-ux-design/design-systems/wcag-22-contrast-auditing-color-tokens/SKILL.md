---
name: wcag-22-contrast-auditing-color-tokens
description: Audits color tokens against WCAG 2.2 AA (4.5:1) and AAA (7:1) contrast ratios across light and dark modes. Use when guaranteeing accessible contrast for text and interactive controls.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/TR/WCAG22/#contrast-minimum"
---
# Wcag 22 Contrast Auditing Color Tokens

## Overview
Poor contrast makes text illegible for users with visual impairments. Automated contrast auditing calculates relative luminance ratios, ensuring body text achieves >= 4.5:1 and UI borders >= 3.0:1.

## Operational Workflow

1. **Calculate relative luminance of foreground and background colors using the standard formula.**:
   - Calculate relative luminance of foreground and background colors using the standard formula.

2. **Compute contrast ratio**:
   - Compute contrast ratio: (L1 + 0.05) / (L2 + 0.05).

3. **Assert minimum requirements**:
   - Assert minimum requirements: >= 4.5:1 for normal text, >= 3.0:1 for large text, >= 3.0:1 for graphical UI elements.

4. **Automate contrast audit across all foreground/background token pairings across both light and dark themes.**:
   - Automate contrast audit across all foreground/background token pairings across both light and dark themes.

## Recommended Tools & Environments
- Color Contrast Math
- WCAG 2.2 AA/AAA
- APCA
- Color Tokens

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
