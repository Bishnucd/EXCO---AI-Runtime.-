---
name: reciprocal-rank-fusion-hybrid-search
description: Combines sparse BM25 and dense vector search results using the Reciprocal Rank Fusion (RRF) algorithm. Use when blending lexical and semantic rankings without manual score normalization.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking#reciprocal-rank-fusion-rrf"
---
# Reciprocal Rank Fusion Hybrid Search

## Overview
Dense cosine distances and sparse BM25 scores operate on incompatible scales. RRF scores documents based purely on their reciprocal ranking positions across both retrieval passes.

## Operational Workflow

1. **Execute parallel dense vector ANN query and sparse BM25 keyword search for input query.**:
   - Execute parallel dense vector ANN query and sparse BM25 keyword search for input query.

2. **Assign rank positions (1..K) to retrieved documents within each respective result list.**:
   - Assign rank positions (1..K) to retrieved documents within each respective result list.

3. **Calculate RRF score for each document**:
   - Calculate RRF score for each document: Score = sum(1 / (k + rank_i)) where k is typically 60.

4. **Sort combined document candidate set by computed RRF score and return top-N merged items.**:
   - Sort combined document candidate set by computed RRF score and return top-N merged items.

## Recommended Tools & Environments
- Reciprocal Rank Fusion (RRF)
- Hybrid Search
- BM25 + Vector
- Information Retrieval

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
