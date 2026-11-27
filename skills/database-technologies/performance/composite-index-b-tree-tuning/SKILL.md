---
name: composite-index-b-tree-tuning
description: Designs composite B-Tree indexes adhering to the equality-range-sort rule in relational databases. Use when optimizing multi-column filtering and sorting operations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://use-the-index-luke.com/sql/where-clause/searching-for-ranges/greater-less-between-tuning-sql-indexing"
---
# Composite Index B Tree Tuning

## Overview
Multi-column queries require composite indexes ordered properly. Placing equality columns first, followed by range conditions, followed by sort columns maximizes index scan selectivity.

## Operational Workflow

1. **Audit query WHERE clauses**:
   - Audit query WHERE clauses: categorize filters into Equality (=) and Range (<, >, BETWEEN).

2. **Order composite index columns**:
   - Order composite index columns: Equality columns first, then Sort (ORDER BY) columns, then Range columns.

3. **Add covering index INCLUDE columns to satisfy queries purely from the index leaf pages (Index Only Scan).**:
   - Add covering index INCLUDE columns to satisfy queries purely from the index leaf pages (Index Only Scan).

4. **Verify that query planner executes Index Scan rather than Bitmap Heap Scan with Recheck conditions.**:
   - Verify that query planner executes Index Scan rather than Bitmap Heap Scan with Recheck conditions.

## Recommended Tools & Environments
- PostgreSQL / MySQL
- B-Tree Indexes
- SQL DDL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
