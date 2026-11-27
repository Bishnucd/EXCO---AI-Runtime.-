---
name: postgres-explain-analyze-optimizer
description: Analyzes query execution plans using PostgreSQL EXPLAIN (ANALYZE, BUFFERS) to eliminate sequential scans and expensive joins. Use when diagnosing slow relational database queries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.postgresql.org/docs/current/using-explain.html"
---
# Postgres Explain Analyze Optimizer

## Overview
Slow queries often stem from missing indexes, inaccurate table statistics, or catastrophic nested loop joins. Analyzing EXPLAIN BUFFERS execution plans identifies exact disk I/O bottlenecks.

## Operational Workflow

1. **Run EXPLAIN (ANALYZE, BUFFERS, VERBOSE) on slow target query statements.**:
   - Run EXPLAIN (ANALYZE, BUFFERS, VERBOSE) on slow target query statements.

2. **Identify sequential scans (Seq Scan) across large tables with high row counts.**:
   - Identify sequential scans (Seq Scan) across large tables with high row counts.

3. **Inspect nested loop joins and compare estimated row counts with actual row counts to spot stale planner statistics.**:
   - Inspect nested loop joins and compare estimated row counts with actual row counts to spot stale planner statistics.

4. **Apply partial indexes, multi-column indexes, or rewrite query predicates to utilize index scans.**:
   - Apply partial indexes, multi-column indexes, or rewrite query predicates to utilize index scans.

## Recommended Tools & Environments
- PostgreSQL
- EXPLAIN ANALYZE
- pg_stat_statements
- SQL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
