---
name: pdf-accessible-tagging-pdfua-audit
description: Audits and applies PDF/UA (Universal Accessibility) tags, reading orders, and alternate text to PDF documents. Use when ensuring government and legal PDF document accessibility compliance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.pdfa.org/resource/pdfua-in-a-nutshell/"
---
# Pdf Accessible Tagging Pdfua Audit

## Overview
Untagged PDFs are unreadable by screen readers. PDF/UA standardizes document structure trees (<H1>, <P>, <Table>), logical reading order, and alt text for all embedded figures.

## Operational Workflow

1. **Inspect PDF structure tree and verify presence of /StructTreeRoot dictionary.**:
   - Inspect PDF structure tree and verify presence of /StructTreeRoot dictionary.

2. **Ensure all headings, paragraphs, and list items are encapsulated in semantic structure tags.**:
   - Ensure all headings, paragraphs, and list items are encapsulated in semantic structure tags.

3. **Verify that all image figures include non-empty /Alt alternative text descriptions.**:
   - Verify that all image figures include non-empty /Alt alternative text descriptions.

4. **Audit document using VeraPDF to confirm 100% compliance with ISO 14289-1 standards.**:
   - Audit document using VeraPDF to confirm 100% compliance with ISO 14289-1 standards.

## Recommended Tools & Environments
- PDF/UA
- ISO 14289-1
- VeraPDF / PAC
- Accessibility

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
