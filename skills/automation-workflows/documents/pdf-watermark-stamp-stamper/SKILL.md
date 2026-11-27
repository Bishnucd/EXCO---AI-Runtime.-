---
name: pdf-watermark-stamp-stamper
description: Overlays semi-transparent security watermarks, confidential stamps, and user IDs across PDF document pages. Use when protecting sensitive internal reports and customer contracts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pypdf.readthedocs.io/en/stable/user/watermark.html"
---
# Pdf Watermark Stamp Stamper

## Overview
Preventing confidential document leaks requires dynamic watermarking. Generating single-page watermark overlays with ReportLab and merging them across PDF pages brands every page.

## Operational Workflow

1. **Generate transparent PDF watermark canvas specifying user email, timestamp, and "CONFIDENTIAL".**:
   - Generate transparent PDF watermark canvas specifying user email, timestamp, and "CONFIDENTIAL".

2. **Open target multi-page PDF document using pypdf.PdfReader.**:
   - Open target multi-page PDF document using pypdf.PdfReader.

3. **Iterate through document pages and execute page.merge_page(watermark_page).**:
   - Iterate through document pages and execute page.merge_page(watermark_page).

4. **Write watermarked document to output stream with compression preservation.**:
   - Write watermarked document to output stream with compression preservation.

## Recommended Tools & Environments
- pypdf / PyMuPDF
- Python 3.10+
- PDF
- ReportLab

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
