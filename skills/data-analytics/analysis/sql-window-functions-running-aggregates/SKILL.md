---
name: sql-window-functions-running-aggregates
description: Calculates rolling moving averages, cumulative year-to-date totals, and rankings using SQL window functions. Use when authoring analytical SQL transformations without self-joins.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.postgresql.org/docs/current/tutorial-window.html"
---
# Sql Window Functions Running Aggregates

## Overview
Self-joins for calculating running totals are slow and unreadable. SQL window functions (SUM() OVER (...), LAG(), DENSE_RANK()) compute moving averages and row comparisons in a single efficient pass.

## Operational Workflow

1. **Structure analytical queries with OVER (PARTITION BY category ORDER BY date) clauses.**:
   - Structure analytical queries with OVER (PARTITION BY category ORDER BY date) clauses.

2. **Compute 7-day rolling moving averages using ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.**:
   - Compute 7-day rolling moving averages using ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.

3. **Calculate period-over-period percentage growth using LAG() to inspect previous row values.**:
   - Calculate period-over-period percentage growth using LAG() to inspect previous row values.

4. **Assign partition-based rankings using ROW_NUMBER(), RANK(), and DENSE_RANK().**:
   - Assign partition-based rankings using ROW_NUMBER(), RANK(), and DENSE_RANK().

## Recommended Tools & Environments
- SQL Window Functions
- OVER (PARTITION BY ... ORDER BY ...)
- PostgreSQL
- BigQuery

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
