---
name: cassandra-tombstone-compaction-tuning
description: Manages Cassandra and ScyllaDB tombstone thresholds and compaction strategies to eliminate read timeouts. Use when handling high delete volumes in distributed column families.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cassandra.apache.org/doc/latest/cassandra/operating/compaction/index.html"
---
# Cassandra Tombstone Compaction Tuning

## Overview
Deletes in Cassandra write tombstone markers. Scanning thousands of tombstones during reads triggers ReadFailureException. Proper compaction strategies purge tombstones aggressively.

## Operational Workflow

1. **Inspect nodetool tablestats output to check Tombstone Cells Encountered per read.**:
   - Inspect nodetool tablestats output to check Tombstone Cells Encountered per read.

2. **Configure table gc_grace_seconds based on cluster repair frequency (e.g., reduce from 10 days to 3 days).**:
   - Configure table gc_grace_seconds based on cluster repair frequency (e.g., reduce from 10 days to 3 days).

3. **Select appropriate compaction strategy**:
   - Select appropriate compaction strategy: LeveledCompactionStrategy (LCS) or TimeWindowCompactionStrategy (TWCS).

4. **Tune tombstone_threshold and tombstone_compaction_interval to trigger early single-SSTable purges.**:
   - Tune tombstone_threshold and tombstone_compaction_interval to trigger early single-SSTable purges.

## Recommended Tools & Environments
- Apache Cassandra
- ScyllaDB
- Compaction Strategies
- Tombstone Management

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
