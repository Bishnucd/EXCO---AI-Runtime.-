---
name: reranker-cross-encoder-scoring
description: Scores and reorders candidate retrieval chunks using a cross-encoder reranking model (e.g. BGE-Reranker, Cohere). Use when improving precision of top-k chunks passed to LLM generation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://huggingface.co/BAAI/bge-reranker-large"
---
# Reranker Cross Encoder Scoring

## Overview
Bi-encoder vector search computes cosine distance on compressed embeddings, losing fine token interactions. Cross-encoder rerankers jointly encode query and chunk pairs, yielding vastly superior relevance scores.

## Operational Workflow

1. **Retrieve high-recall candidate pool (e.g., top 50 chunks) using fast bi-encoder vector similarity.**:
   - Retrieve high-recall candidate pool (e.g., top 50 chunks) using fast bi-encoder vector similarity.

2. **Formulate (query, chunk_text) pairs for all candidate documents.**:
   - Formulate (query, chunk_text) pairs for all candidate documents.

3. **Score candidate pairs using cross-encoder model to compute uncompressed relevance logits.**:
   - Score candidate pairs using cross-encoder model to compute uncompressed relevance logits.

4. **Sort candidates by reranker score and return the top 5 most relevant chunks for context assembly.**:
   - Sort candidates by reranker score and return the top 5 most relevant chunks for context assembly.

## Recommended Tools & Environments
- Python 3.10+
- CrossEncoder
- Sentence-Transformers
- HuggingFace

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
