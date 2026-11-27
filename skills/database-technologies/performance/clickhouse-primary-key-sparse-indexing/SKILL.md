---
name: clickhouse-primary-key-sparse-indexing
description: Optimizes ClickHouse sparse primary key ordering and index granularity for high-speed columnar filtering. Use when designing high-speed analytical queries over billions of rows.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://clickhouse.com/docs/en/optimize/sparse-primary-indexes"
---
# Clickhouse Primary Key Sparse Indexing

## Overview
ClickHouse creates sparse primary index marks every 8,192 rows (index_granularity). Designing ORDER BY tuples from lowest to highest cardinality enables massive granule skipping.

## Operational Workflow

1. **Order table PRIMARY KEY columns starting with low-cardinality filtering fields (tenant_id, date, event_type).**:
   - Order table PRIMARY KEY columns starting with low-cardinality filtering fields (tenant_id, date, event_type).

2. **Avoid high-cardinality unique IDs (UUIDs) at the beginning of the primary key definition.**:
   - Avoid high-cardinality unique IDs (UUIDs) at the beginning of the primary key definition.

3. **Run EXPLAIN indexes = 1 SELECT ... to verify query skips unneeded granules.**:
   - Run EXPLAIN indexes = 1 SELECT ... to verify query skips unneeded granules.

4. **Benchmark query scanning to confirm sub-100ms response time across 1 billion rows.**:
   - Benchmark query scanning to confirm sub-100ms response time across 1 billion rows.

## Recommended Tools & Environments
- ClickHouse
- Sparse Indexing
- MergeTree
- Columnar Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
