---
name: scylladb-partition-clustering-key-design
description: Designs optimal partition keys and clustering columns for ScyllaDB and Apache Cassandra. Use when eliminating hot spots and tombstone warnings in high-write NoSQL systems.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.scylladb.com/stable/architecture/architecture-glossary.html#partition-key"
---
# Scylladb Partition Clustering Key Design

## Overview
ScyllaDB achieves millions of IOPS per node when data is evenly distributed. Proper partition key design avoids node hotspots, while clustering keys organize data on disk for fast range queries.

## Operational Workflow

1. **Determine primary query access patterns before designing table schemas.**:
   - Determine primary query access patterns before designing table schemas.

2. **Select high-cardinality partition keys ((tenant_id, date)) to distribute writes across all cluster cores.**:
   - Select high-cardinality partition keys ((tenant_id, date)) to distribute writes across all cluster cores.

3. **Define clustering keys (event_timestamp DESC) to physically sort data on disk for range scans.**:
   - Define clustering keys (event_timestamp DESC) to physically sort data on disk for range scans.

4. **Validate partition size metrics using nodetool tablehistograms to guarantee partitions stay under 100MB.**:
   - Validate partition size metrics using nodetool tablehistograms to guarantee partitions stay under 100MB.

## Recommended Tools & Environments
- ScyllaDB
- Apache Cassandra
- Data Modeling
- NoSQL Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
