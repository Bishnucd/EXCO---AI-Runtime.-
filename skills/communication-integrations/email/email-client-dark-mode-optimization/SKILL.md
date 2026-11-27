---
name: email-client-dark-mode-optimization
description: Implements CSS prefers-color-scheme media queries and meta tags for Apple Mail and Outlook dark modes. Use when preventing washed-out logos and illegible text in dark mode email clients.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers"
---
# Email Client Dark Mode Optimization

## Overview
Email clients invert background and text colors automatically, turning dark logos invisible on black backgrounds. Explicit dark mode CSS tags and translucent logo strokes ensure perfect readability.

## Operational Workflow

1. **Add <meta name="color-scheme" content="light dark"> and <meta name="supported-color-schemes" content="light dark">.**:
   - Add <meta name="color-scheme" content="light dark"> and <meta name="supported-color-schemes" content="light dark">.

2. **Declare @media (prefers-color-scheme**:
   - Declare @media (prefers-color-scheme: dark) styles overriding background and text colors.

3. **Add white outer glow or translucent stroke to dark PNG logos so they remain visible on dark surfaces.**:
   - Add white outer glow or translucent stroke to dark PNG logos so they remain visible on dark surfaces.

4. **Test rendered email across Apple Mail, Gmail Android, and Outlook Windows dark mode engines.**:
   - Test rendered email across Apple Mail, Gmail Android, and Outlook Windows dark mode engines.

## Recommended Tools & Environments
- prefers-color-scheme
- HTML Email
- CSS
- Dark Mode

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
