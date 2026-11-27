---
name: hnsw-vector-index-parameter-tuning
description: Tunes Hierarchical Navigable Small World (HNSW) index graph parameters (M, efConstruction, efSearch) for optimal recall vs latency. Use when configuring production vector databases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/nmslib/hnswlib"
---
# Hnsw Vector Index Parameter Tuning

## Overview
HNSW builds multi-layer proximity graphs. Tuning M (connections per element), efConstruction (build depth), and efSearch (query search scope) achieves >98% recall with sub-5ms latency.

## Operational Workflow

1. **Select M parameter (16–64) balancing graph memory footprint against recall connectivity.**:
   - Select M parameter (16–64) balancing graph memory footprint against recall connectivity.

2. **Set efConstruction (100–250) during indexing to ensure dense, high-quality graph formation.**:
   - Set efConstruction (100–250) during indexing to ensure dense, high-quality graph formation.

3. **Dynamically adjust efSearch (40–120) at query time to trade off latency vs retrieval recall.**:
   - Dynamically adjust efSearch (40–120) at query time to trade off latency vs retrieval recall.

4. **Benchmark Recall@K and QPS (queries per second) against ground-truth exact k-NN sweeps.**:
   - Benchmark Recall@K and QPS (queries per second) against ground-truth exact k-NN sweeps.

## Recommended Tools & Environments
- HNSW
- Vector Search
- ANN Benchmarks
- Qdrant / Milvus / pgvector

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
