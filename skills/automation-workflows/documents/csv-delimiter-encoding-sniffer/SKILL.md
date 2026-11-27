---
name: csv-delimiter-encoding-sniffer
description: Detects character encoding (UTF-8, Latin-1, Shift-JIS) and dialect delimiters (comma, tab, semicolon) in raw CSVs. Use when building robust, fault-tolerant CSV ingestion pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.python.org/3/library/csv.html#csv.Sniffer"
---
# Csv Delimiter Encoding Sniffer

## Overview
User-submitted CSV files frequently use unexpected delimiters (semicolons in Europe, tabs) or non-UTF8 encodings. Sniffing byte samples detects dialects automatically before parsing.

## Operational Workflow

1. **Read 64KB initial byte buffer from incoming CSV document file.**:
   - Read 64KB initial byte buffer from incoming CSV document file.

2. **Detect character encoding using charset-normalizer and decode buffer to text.**:
   - Detect character encoding using charset-normalizer and decode buffer to text.

3. **Use csv.Sniffer().sniff() to determine delimiter, quotechar, and doublequote conventions.**:
   - Use csv.Sniffer().sniff() to determine delimiter, quotechar, and doublequote conventions.

4. **Initialize CSV reader with detected dialect and execute clean, error-free parsing.**:
   - Initialize CSV reader with detected dialect and execute clean, error-free parsing.

## Recommended Tools & Environments
- Python csv.Sniffer
- chardet / charset-normalizer
- CSV
- Encoding

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
