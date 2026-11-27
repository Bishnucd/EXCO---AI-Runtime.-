---
name: mjml-responsive-email-transpiler
description: Authors semantic, component-based email layouts in MJML and compiles them to bulletproof HTML. Use when building responsive email templates that render reliably across legacy Outlook.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://mjml.io/documentation/"
---
# Mjml Responsive Email Transpiler

## Overview
Outlook desktop relies on the Microsoft Word HTML rendering engine, breaking modern CSS. MJML provides high-level tags (<mj-section>, <mj-column>) that compile to complex Outlook-compatible tables.

## Operational Workflow

1. **Author template using semantic MJML tags**:
   - Author template using semantic MJML tags: <mjml><mj-body><mj-section><mj-column>...

2. **Configure styles in <mj-head> using <mj-attributes> for global typography and padding.**:
   - Configure styles in <mj-head> using <mj-attributes> for global typography and padding.

3. **Compile MJML markup into client-ready HTML using mjml2html() compiler.**:
   - Compile MJML markup into client-ready HTML using mjml2html() compiler.

4. **Verify that compiled HTML incorporates conditional Outlook VML comments and table wrappers.**:
   - Verify that compiled HTML incorporates conditional Outlook VML comments and table wrappers.

## Recommended Tools & Environments
- MJML CLI
- Node.js
- Responsive HTML Email
- Outlook VML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
