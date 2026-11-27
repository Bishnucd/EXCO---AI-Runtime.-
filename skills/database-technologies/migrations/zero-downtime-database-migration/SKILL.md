---
name: zero-downtime-database-migration
description: Executes expand-and-contract zero-downtime database schema migrations for relational databases. Use when altering database columns or tables without locking tables or taking downtime.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://martinfowler.com/bliki/ParallelRun.html"
---
# Zero Downtime Database Migration

## Overview
Direct column renames or removals lock tables and break running application code. The expand-contract pattern creates new columns, writes to both during a transition phase, backfills data, and prunes old columns.

## Operational Workflow

1. **Expand**:
   - Expand: Add new nullable column or table in parallel with the legacy structure.

2. **Transition**:
   - Transition: Update application code to write dual records to both old and new schema locations.

3. **Backfill**:
   - Backfill: Run throttled batch updates migrating historical records from old columns to new columns.

4. **Contract**:
   - Contract: Update application code to read exclusively from the new schema, then safely drop old structures.

## Recommended Tools & Environments
- PostgreSQL / MySQL
- Flyway / Liquibase
- SQL
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
