---
name: vitess-horizontal-sharding-keyspace-design
description: Designs Vitess keyspaces and VSchema sharding keys to scale MySQL horizontally across distributed clusters. Use when scaling MySQL beyond single-server write capacity.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://vitess.io/docs/concepts/sharding/"
---
# Vitess Horizontal Sharding Keyspace Design

## Overview
Vitess powers massive MySQL deployments by distributing database rows across multiple shard instances using VSchema routing rules and distributed VTGate proxies.

## Operational Workflow

1. **Analyze primary application entities to select an optimal sharding column (e.g., customer_id).**:
   - Analyze primary application entities to select an optimal sharding column (e.g., customer_id).

2. **Define VSchema JSON declaring hash sharding vindex (e.g., xxhash64) over keyspace tables.**:
   - Define VSchema JSON declaring hash sharding vindex (e.g., xxhash64) over keyspace tables.

3. **Deploy Vitess VTGate proxies and VTTablet daemons managing underlying MySQL shard instances.**:
   - Deploy Vitess VTGate proxies and VTTablet daemons managing underlying MySQL shard instances.

4. **Execute distributed queries through VTGate, monitoring cross-shard scatter-gather routing.**:
   - Execute distributed queries through VTGate, monitoring cross-shard scatter-gather routing.

## Recommended Tools & Environments
- Vitess
- MySQL Sharding
- VSchema
- Horizontal Scaling

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
