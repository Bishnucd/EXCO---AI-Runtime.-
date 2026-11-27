---
name: contextual-compression-llm-reranking
description: Extracts only query-relevant sentences from retrieved passages using contextual compression and LLM reranking. Use when reducing prompt token clutter and eliminating distracting noise.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://python.langchain.com/docs/how_to/contextual_compression/"
---
# Contextual Compression Llm Reranking

## Overview
Retrieved 1,000-token chunks often contain only 50 tokens of relevant information. Contextual compression prunes irrelevant sentences and reranks passages before prompt construction.

## Operational Workflow

1. **Retrieve top-K raw document chunks from primary vector search layer.**:
   - Retrieve top-K raw document chunks from primary vector search layer.

2. **Pass each candidate passage through cross-encoder reranker or compression LLM prompt.**:
   - Pass each candidate passage through cross-encoder reranker or compression LLM prompt.

3. **Extract only the precise sentences directly answering the user query.**:
   - Extract only the precise sentences directly answering the user query.

4. **Assemble compressed extracts into a compact prompt context, saving 70% of context tokens.**:
   - Assemble compressed extracts into a compact prompt context, saving 70% of context tokens.

## Recommended Tools & Environments
- Contextual Compression
- LLM Reranker
- Token Pruning
- LangChain

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
