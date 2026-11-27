---
name: pandoc-universal-document-converter
description: Converts documents across Markdown, DOCX, LaTeX, HTML, and RST formats with filter extensions using Pandoc. Use when converting document formats in automated publishing pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pandoc.org/MANUAL.html"
---
# Pandoc Universal Document Converter

## Overview
Pandoc is the Swiss-army knife of document conversion. Its abstract syntax tree (AST) intermediate representation enables lossless translation across dozens of document formats.

## Operational Workflow

1. **Define input source format (markdown, rst, docx) and target output format (html, latex, docx).**:
   - Define input source format (markdown, rst, docx) and target output format (html, latex, docx).

2. **Apply custom Lua filters to transform AST nodes (e.g. rewrite image paths, format callout boxes).**:
   - Apply custom Lua filters to transform AST nodes (e.g. rewrite image paths, format callout boxes).

3. **Pass reference document templates to maintain corporate typography, margins, and headers.**:
   - Pass reference document templates to maintain corporate typography, margins, and headers.

4. **Execute pandoc -s input.md -o output.docx and verify rendered output fidelity.**:
   - Execute pandoc -s input.md -o output.docx and verify rendered output fidelity.

## Recommended Tools & Environments
- Pandoc CLI
- Lua Filters
- Markdown / LaTeX
- DOCX

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
