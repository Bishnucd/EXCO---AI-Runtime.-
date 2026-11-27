---
name: cockroachdb-online-schema-change-pipeline
description: Executes distributed, non-blocking online schema changes on CockroachDB clusters. Use when adding columns, indexes, and constraints to distributed SQL databases without table locks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.cockroachlabs.com/docs/stable/online-schema-changes"
---
# Cockroachdb Online Schema Change Pipeline

## Overview
CockroachDB runs schema changes asynchronously across distributed nodes using multi-version concurrency control (MVCC), guaranteeing non-blocking reads and writes throughout the migration.

## Operational Workflow

1. **Execute DDL statement (e.g., ALTER TABLE orders ADD COLUMN fulfillment_status STRING).**:
   - Execute DDL statement (e.g., ALTER TABLE orders ADD COLUMN fulfillment_status STRING).

2. **CockroachDB transitions schema through internal states (delete-only, write-only, public).**:
   - CockroachDB transitions schema through internal states (delete-only, write-only, public).

3. **Monitor schema transition progress via SHOW JOBS query.**:
   - Monitor schema transition progress via SHOW JOBS query.

4. **Verify schema state across all distributed regional cluster nodes.**:
   - Verify schema state across all distributed regional cluster nodes.

## Recommended Tools & Environments
- CockroachDB
- Distributed SQL
- Online Schema Changes
- Multi-Region

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
