---
name: pg-repack-table-bloat-online-cleanup
description: Removes table and index bloat in PostgreSQL without exclusive table locks using pg_repack. Use when reclaiming disk space and restoring sequential scan performance on active databases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://reorg.github.io/pg_repack/"
---
# Pg Repack Table Bloat Online Cleanup

## Overview
Standard VACUUM FULL locks tables completely. pg_repack creates a temporary table, copies live tuples, applies incremental changes via triggers, and swaps tables in a millisecond lock.

## Operational Workflow

1. **Install pg_repack extension on PostgreSQL server.**:
   - Install pg_repack extension on PostgreSQL server.

2. **Query pg_stat_user_tables and bloat estimation views to identify heavily bloated tables.**:
   - Query pg_stat_user_tables and bloat estimation views to identify heavily bloated tables.

3. **Execute pg_repack --table schema.table_name --no-kill-backend against target table.**:
   - Execute pg_repack --table schema.table_name --no-kill-backend against target table.

4. **Verify reclaimed disk storage and monitor query sequential scan performance improvements.**:
   - Verify reclaimed disk storage and monitor query sequential scan performance improvements.

## Recommended Tools & Environments
- PostgreSQL
- pg_repack
- Bloat Cleanup
- Zero Downtime Maintenance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
