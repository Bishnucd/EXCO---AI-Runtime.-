---
name: wcag-accessibility-contrast-auditing
description: Audits color contrast ratios, focus visible states, and semantic ARIA attributes per WCAG 2.2 AA standards. Use when verifying web application accessibility compliance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/WAI/WCAG22/quickref/"
---
# Wcag Accessibility Contrast Auditing

## Overview
Inaccessible websites alienate users with disabilities and invite legal risk. Auditing contrast ratios (4.5:1 text, 3:1 graphical elements), keyboard focus indicators, and screen reader labels ensures compliance.

## Operational Workflow

1. **Measure foreground text to background surface color contrast ratios against 4.5**:
   - Measure foreground text to background surface color contrast ratios against 4.5:1 AA standards.

2. **Verify 3**:
   - Verify 3:1 contrast ratios on active UI boundaries, form inputs, and interactive icons.

3. **Ensure every interactive element features an unambiguous 2px high-contrast **:
   - Ensure every interactive element features an unambiguous 2px high-contrast :focus-visible ring.

4. **Run axe-core automated audits to verify proper ARIA landmarks, roles, and alternative text attributes.**:
   - Run axe-core automated audits to verify proper ARIA landmarks, roles, and alternative text attributes.

## Recommended Tools & Environments
- WCAG 2.2
- axe-core
- Color Contrast Analyser
- HTML/ARIA

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
