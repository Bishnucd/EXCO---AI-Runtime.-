---
name: cockroachdb-follower-reads-latency-tuning
description: Tunes distributed CockroachDB read latency using Follower Reads with bounded staleness. Use when serving low-latency global reads without routing traffic to the Raft leaseholder.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.cockroachlabs.com/docs/stable/follower-reads"
---
# Cockroachdb Follower Reads Latency Tuning

## Overview
In distributed SQL, routing all reads to the Raft range leaseholder incurs cross-region network latency. Follower reads let local replicas serve reads at AS OF SYSTEM TIME with bounded staleness.

## Operational Workflow

1. **Identify read queries that tolerate slightly stale data (e.g., product catalog or public profiles).**:
   - Identify read queries that tolerate slightly stale data (e.g., product catalog or public profiles).

2. **Append AS OF SYSTEM TIME with_max_staleness(INTERVAL 10 SECOND) to SELECT queries.**:
   - Append AS OF SYSTEM TIME with_max_staleness(INTERVAL 10 SECOND) to SELECT queries.

3. **Ensure target tables have enterprise or cluster setting kv.closed_timestamp.lead_for_reads enabled.**:
   - Ensure target tables have enterprise or cluster setting kv.closed_timestamp.lead_for_reads enabled.

4. **Verify query latency drops from 120ms (cross-continent) to <5ms (local node replica).**:
   - Verify query latency drops from 120ms (cross-continent) to <5ms (local node replica).

## Recommended Tools & Environments
- CockroachDB
- Follower Reads
- Distributed SQL
- Latency Optimization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
