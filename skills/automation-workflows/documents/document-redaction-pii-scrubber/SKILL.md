---
name: document-redaction-pii-scrubber
description: Applies permanent vector redaction to remove social security numbers, credit cards, and PII from PDF files. Use when sanitizing confidential legal disclosures and FOIA records.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pymupdf.readthedocs.io/en/latest/redactions.html"
---
# Document Redaction Pii Scrubber

## Overview
Drawing a black rectangle over text leaves the underlying text searchable in the PDF. True redaction physically strips character bytes from the document tree and draws opaque rectangles.

## Operational Workflow

1. **Search document text for PII patterns using regex (SSN, credit cards, phone numbers).**:
   - Search document text for PII patterns using regex (SSN, credit cards, phone numbers).

2. **Compute bounding box rectangles for all matched sensitive text strings.**:
   - Compute bounding box rectangles for all matched sensitive text strings.

3. **Add redaction annotations to page using page.add_redact_annot(rect).**:
   - Add redaction annotations to page using page.add_redact_annot(rect).

4. **Execute page.apply_redactions() to permanently destroy text streams and image pixels beneath masks.**:
   - Execute page.apply_redactions() to permanently destroy text streams and image pixels beneath masks.

## Recommended Tools & Environments
- PyMuPDF (fitz)
- Regex PII Detectors
- PDF Sanitization
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
