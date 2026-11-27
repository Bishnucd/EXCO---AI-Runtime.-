---
name: pdf-table-extraction-camelot
description: Extracts tabular structures from PDF reports into clean Pandas DataFrames using lattice and stream parsing. Use when parsing financial tables and multi-column tabular documents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://camelot-py.readthedocs.io/"
---
# Pdf Table Extraction Camelot

## Overview
Tables in PDFs lack structural HTML tags and exist merely as positioned text and lines. Camelot isolates table cells using lattice (grid-line detection) or stream (whitespace clustering) algorithms.

## Operational Workflow

1. **Analyze PDF page layout to detect explicit cell borders (lattice mode) or whitespace gutters (stream mode).**:
   - Analyze PDF page layout to detect explicit cell borders (lattice mode) or whitespace gutters (stream mode).

2. **Segment table cells and assign bounding box coordinates.**:
   - Segment table cells and assign bounding box coordinates.

3. **Merge multi-line text blocks within table cells while preserving column alignment.**:
   - Merge multi-line text blocks within table cells while preserving column alignment.

4. **Export extracted tabular data directly into structured Pandas DataFrames or CSV files.**:
   - Export extracted tabular data directly into structured Pandas DataFrames or CSV files.

## Recommended Tools & Environments
- Python 3.10+
- Camelot
- OpenCV
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
