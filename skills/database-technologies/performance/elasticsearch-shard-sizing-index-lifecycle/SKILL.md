---
name: elasticsearch-shard-sizing-index-lifecycle
description: Configures Elasticsearch and OpenSearch primary shard sizing and Index Lifecycle Management (ILM). Use when optimizing cluster stability, search speed, and storage utilization.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.elastic.co/guide/en/elasticsearch/reference/current/size-your-shards.html"
---
# Elasticsearch Shard Sizing Index Lifecycle

## Overview
Oversharding wastes JVM heap memory while undersharding causes search bottlenecks. Optimal setups maintain shard sizes between 20GB and 50GB and automate rollover via ILM policies.

## Operational Workflow

1. **Define ILM policy with hot, warm, cold, and delete phases based on index age and size.**:
   - Define ILM policy with hot, warm, cold, and delete phases based on index age and size.

2. **Configure hot phase rollover when index primary shard reaches 30GB or 30 days age.**:
   - Configure hot phase rollover when index primary shard reaches 30GB or 30 days age.

3. **Transition indices to warm phase with replica reduction and force_merge to 1 segment.**:
   - Transition indices to warm phase with replica reduction and force_merge to 1 segment.

4. **Monitor cluster JVM memory pressure and unassigned shard counts via _cat/shards.**:
   - Monitor cluster JVM memory pressure and unassigned shard counts via _cat/shards.

## Recommended Tools & Environments
- Elasticsearch
- OpenSearch
- Index Lifecycle Management (ILM)
- Cluster Architecture

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
