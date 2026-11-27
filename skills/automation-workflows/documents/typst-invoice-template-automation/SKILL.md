---
name: typst-invoice-template-automation
description: Compiles dynamic transactional billing invoices from Typst templates with currency formatting and line items. Use when generating beautiful, modern PDF invoices with blazing-fast compile times.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://typst.app/docs/tutorial/"
---
# Typst Invoice Template Automation

## Overview
Typst compiles in milliseconds, making it ideal for real-time PDF generation. Templating invoice calculations, line item tables, and client details produces modern, vector-sharp invoice documents.

## Operational Workflow

1. **Author master invoice.typ template with layout grid, customer metadata, and table styling.**:
   - Author master invoice.typ template with layout grid, customer metadata, and table styling.

2. **Pass dynamic order JSON data into Typst using sys.inputs or external data loading.**:
   - Pass dynamic order JSON data into Typst using sys.inputs or external data loading.

3. **Execute automatic subtotal, tax calculation, and currency formatting in Typst code.**:
   - Execute automatic subtotal, tax calculation, and currency formatting in Typst code.

4. **Compile directly to PDF using typst compile --input data=... in under 50 milliseconds.**:
   - Compile directly to PDF using typst compile --input data=... in under 50 milliseconds.

## Recommended Tools & Environments
- Typst
- CLI
- Rust Engine
- PDF

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
