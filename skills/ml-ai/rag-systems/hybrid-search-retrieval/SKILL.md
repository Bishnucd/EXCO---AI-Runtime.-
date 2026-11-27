---
name: hybrid-search-retrieval
description: Implements hybrid search combining dense vector similarity with sparse BM25 keyword matching and Reciprocal Rank Fusion (RRF). Use when building RAG retrieval pipelines that require both semantic understanding and exact keyword precision.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/langchain-ai/langchain"
---

# Hybrid Search Retrieval

## Overview
Dense vector retrieval excels at capturing semantic intent but often misses exact acronyms, part numbers, or rare keywords. Sparse BM25 keyword search excels at precise token matching but fails when queries use synonyms. Hybrid search executes both retrieval techniques in parallel and combines the resulting rank lists using Reciprocal Rank Fusion (RRF).

## Operational Workflow

1. **Query Parsing and Preprocessing**:
   - Normalize user query text (case normalization, punctuation stripping for sparse index).
   - Generate dense vector embedding using the target embedding model (e.g., `text-embedding-3-small` or HuggingFace BGE).

2. **Parallel Retrieval Execution**:
   - Query the dense vector index (top-k = 50) using cosine similarity.
   - Query the sparse inverted index (BM25 top-k = 50) with tokenized terms.

3. **Reciprocal Rank Fusion (RRF)**:
   - For each document $d$ appearing in either result set, calculate:
     $$RRF(d) = \sum_{m \in \{dense, sparse\}} \frac{1}{k + rank_m(d)}$$
     where $k$ is the smoothing constant (standard default: $k = 60$).
   - Sort documents by descending $RRF$ score.

4. **Context Window Assembly**:
   - Deduplicate retrieved document chunks by ID.
   - Slice top-$N$ documents (typically top 5 to 10) to fit within context token limits.
   - Attach citation metadata (source file, section header, chunk index).
