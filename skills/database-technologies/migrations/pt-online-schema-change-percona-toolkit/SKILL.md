---
name: pt-online-schema-change-percona-toolkit
description: Executes online non-blocking MySQL table alterations using Percona Toolkit pt-online-schema-change. Use when altering schema on production MySQL instances without blocking reads or writes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.percona.com/percona-toolkit/pt-online-schema-change.html"
---
# Pt Online Schema Change Percona Toolkit

## Overview
pt-online-schema-change creates a duplicate empty table, creates triggers to capture live updates, copies existing rows in micro-batches, and swaps tables atomically.

## Operational Workflow

1. **Dry-run migration command using --dry-run flag to validate table locks and foreign keys.**:
   - Dry-run migration command using --dry-run flag to validate table locks and foreign keys.

2. **Specify --chunk-size and --max-lag thresholds to throttle copying during peak traffic.**:
   - Specify --chunk-size and --max-lag thresholds to throttle copying during peak traffic.

3. **Execute live alteration command with --execute flag.**:
   - Execute live alteration command with --execute flag.

4. **Verify trigger cleanup and successful table promotion.**:
   - Verify trigger cleanup and successful table promotion.

## Recommended Tools & Environments
- Percona Toolkit
- pt-online-schema-change
- MySQL
- Triggers

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
