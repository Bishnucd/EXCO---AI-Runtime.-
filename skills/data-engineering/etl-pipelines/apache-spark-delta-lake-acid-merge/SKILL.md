---
name: apache-spark-delta-lake-acid-merge
description: Executes ACID upserts and deletes on petabyte-scale lakehouse tables using Apache Spark and Delta Lake. Use when synchronizing change data capture streams into data lake tables.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.delta.io/latest/delta-update.html#upsert-into-a-table-using-merge"
---
# Apache Spark Delta Lake Acid Merge

## Overview
Delta Lake provides ACID transactions, schema enforcement, and time travel over object storage. Spark Delta MERGE efficiently matches and updates existing records while inserting new ones.

## Operational Workflow

1. **Read incoming micro-batch stream of updated and inserted source entity records.**:
   - Read incoming micro-batch stream of updated and inserted source entity records.

2. **Initialize DeltaTable instance pointing to target S3/ADLS lakehouse parquet directory.**:
   - Initialize DeltaTable instance pointing to target S3/ADLS lakehouse parquet directory.

3. **Execute delta_table.merge matching on primary key identifier condition.**:
   - Execute delta_table.merge matching on primary key identifier condition.

4. **Apply whenMatchedUpdate and whenNotMatchedInsert logic with audit timestamp updates.**:
   - Apply whenMatchedUpdate and whenNotMatchedInsert logic with audit timestamp updates.

## Recommended Tools & Environments
- Apache Spark
- Delta Lake
- PySpark / Scala
- Lakehouse

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
