---
name: xlsx-streaming-large-file-parser
description: Streams and parses multi-gigabyte Excel XLSX files without memory exhaustion using openpyxl or exceljs. Use when ingesting massive spreadsheet datasets in automated pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://openpyxl.readthedocs.io/en/stable/optimized.html"
---
# Xlsx Streaming Large File Parser

## Overview
Loading giant Excel workbooks with standard DOM parsers consumes gigabytes of RAM and crashes processes. Streaming parsers read XML row by row, keeping memory usage constant (< 50MB).

## Operational Workflow

1. **Open workbook in optimized read-only streaming mode (load_workbook(filename, read_only=True)).**:
   - Open workbook in optimized read-only streaming mode (load_workbook(filename, read_only=True)).

2. **Iterate worksheet rows sequentially using generator streams.**:
   - Iterate worksheet rows sequentially using generator streams.

3. **Cast cell values to strongly typed primitives while normalizing dates and numbers.**:
   - Cast cell values to strongly typed primitives while normalizing dates and numbers.

4. **Batch process and flush rows to downstream database tables every 5,000 records.**:
   - Batch process and flush rows to downstream database tables every 5,000 records.

## Recommended Tools & Environments
- openpyxl (read_only)
- exceljs
- Python / Node.js
- XLSX

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
