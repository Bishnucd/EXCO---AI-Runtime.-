---
name: pdf-page-reordering-splitter-merger
description: Splits, merges, rotates, and reorders PDF page sequences with zero visual degradation using pypdf. Use when organizing multi-page PDF document bundles and legal closing binders.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pypdf.readthedocs.io/en/stable/user/merging-pdfs.html"
---
# Pdf Page Reordering Splitter Merger

## Overview
Scanning documents often yields misordered, upside-down, or fragmented PDF files. Fast page-level manipulation re-arranges page trees and rotates orientations without rasterizing content.

## Operational Workflow

1. **Instantiate PdfWriter and iterate through input PDF documents.**:
   - Instantiate PdfWriter and iterate through input PDF documents.

2. **Extract specific page index slices (e.g. pages 1-5 from docA, pages 10-15 from docB).**:
   - Extract specific page index slices (e.g. pages 1-5 from docA, pages 10-15 from docB).

3. **Apply page.rotate(90) or page.rotate(180) to fix misaligned landscape scans.**:
   - Apply page.rotate(90) or page.rotate(180) to fix misaligned landscape scans.

4. **Assemble combined page tree into a single optimized output PDF document.**:
   - Assemble combined page tree into a single optimized output PDF document.

## Recommended Tools & Environments
- pypdf
- PyMuPDF (fitz)
- Python
- PDF

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
