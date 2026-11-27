---
name: pg-stat-statements-slow-query-audit
description: Identifies performance bottlenecks and expensive queries in PostgreSQL using pg_stat_statements. Use when auditing slow database queries and optimizing cache hit ratios.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.postgresql.org/docs/current/pgstatstatements.html"
---
# Pg Stat Statements Slow Query Audit

## Overview
pg_stat_statements tracks execution statistics of all SQL queries executed against a PostgreSQL server, revealing queries consuming the most cumulative CPU, I/O, and buffer time.

## Operational Workflow

1. **Enable shared_preload_libraries = pg_stat_statements in postgresql.conf and restart database.**:
   - Enable shared_preload_libraries = pg_stat_statements in postgresql.conf and restart database.

2. **Execute CREATE EXTENSION IF NOT EXISTS pg_stat_statements in target database.**:
   - Execute CREATE EXTENSION IF NOT EXISTS pg_stat_statements in target database.

3. **Query pg_stat_statements sorting by total_exec_time or mean_exec_time to isolate top offenders.**:
   - Query pg_stat_statements sorting by total_exec_time or mean_exec_time to isolate top offenders.

4. **Inspect shared_blks_read vs shared_blks_hit to identify missing indexes causing disk thrashing.**:
   - Inspect shared_blks_read vs shared_blks_hit to identify missing indexes causing disk thrashing.

## Recommended Tools & Environments
- PostgreSQL
- pg_stat_statements
- Query Optimization
- Database Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
