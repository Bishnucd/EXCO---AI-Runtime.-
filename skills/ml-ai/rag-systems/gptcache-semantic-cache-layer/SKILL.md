---
name: gptcache-semantic-cache-layer
description: Caches LLM generation and vector embedding responses using GPTCache similarity matching. Use when reducing API latency from 2,000ms to 20ms and cutting LLM costs by 60%.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/zilliztech/GPTCache"
---
# Gptcache Semantic Cache Layer

## Overview
Exact key-value caching misses semantically identical questions phrased differently. GPTCache embeds incoming queries and returns cached responses if similarity exceeds a strict threshold.

## Operational Workflow

1. **Initialize GPTCache instance with embedding model and vector storage adapter (Milvus/Faiss).**:
   - Initialize GPTCache instance with embedding model and vector storage adapter (Milvus/Faiss).

2. **Configure similarity evaluation metric (e.g., cosine similarity threshold = 0.88).**:
   - Configure similarity evaluation metric (e.g., cosine similarity threshold = 0.88).

3. **Intercept incoming LLM requests**:
   - Intercept incoming LLM requests: query cache before calling external LLM providers.

4. **Return cached answer immediately on hit; on cache miss, query LLM and store prompt/response vector.**:
   - Return cached answer immediately on hit; on cache miss, query LLM and store prompt/response vector.

## Recommended Tools & Environments
- GPTCache
- Semantic Caching
- Vector Search
- Cost Optimization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
