---
name: apache-iceberg-table-compaction
description: Manages Apache Iceberg lakehouse table maintenance: small file compaction, snapshot expiration, and metadata cleanup. Use when maintaining high-performance analytical lakehouse tables.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://iceberg.apache.org/docs/latest/maintenance/"
---
# Apache Iceberg Table Compaction

## Overview
Streaming ingestion into lakehouses creates thousands of tiny Parquet files, degrading query performance. Regular table compaction merges small files and cleans orphaned snapshots.

## Operational Workflow

1. **Analyze Iceberg table metadata to calculate small file distribution and fragmentation.**:
   - Analyze Iceberg table metadata to calculate small file distribution and fragmentation.

2. **Execute rewrite_data_files procedure to compact small Parquet chunks into optimal 512MB files.**:
   - Execute rewrite_data_files procedure to compact small Parquet chunks into optimal 512MB files.

3. **Run expire_snapshots to prune obsolete historical snapshots beyond retention windows.**:
   - Run expire_snapshots to prune obsolete historical snapshots beyond retention windows.

4. **Remove unreferenced data files using remove_orphan_files to reclaim object storage capacity.**:
   - Remove unreferenced data files using remove_orphan_files to reclaim object storage capacity.

## Recommended Tools & Environments
- Apache Iceberg
- Apache Spark / Trino
- Parquet
- AWS S3

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
