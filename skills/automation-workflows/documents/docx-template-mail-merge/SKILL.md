---
name: docx-template-mail-merge
description: Populates Word DOCX templates with dynamic structured data, tables, and images using python-docx. Use when automating the generation of personalized contracts, offers, and certificates.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://python-docx.readthedocs.io/"
---
# Docx Template Mail Merge

## Overview
Manual contract generation is slow and error-prone. Document templates containing Jinja2 placeholder tags enable programmatic generation of styled DOCX files from database records.

## Operational Workflow

1. **Author template DOCX files with placeholder tags ({{ customer_name }}, {% for item in items %}).**:
   - Author template DOCX files with placeholder tags ({{ customer_name }}, {% for item in items %}).

2. **Load template document and validate required data payload against expected schema.**:
   - Load template document and validate required data payload against expected schema.

3. **Execute Jinja2 context rendering to populate text runs, dynamic table rows, and embedded images.**:
   - Execute Jinja2 context rendering to populate text runs, dynamic table rows, and embedded images.

4. **Save final rendered DOCX artifacts and optionally convert them to PDF via LibreOffice headless.**:
   - Save final rendered DOCX artifacts and optionally convert them to PDF via LibreOffice headless.

## Recommended Tools & Environments
- Python 3.10+
- python-docx-template
- Jinja2
- Office Open XML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
