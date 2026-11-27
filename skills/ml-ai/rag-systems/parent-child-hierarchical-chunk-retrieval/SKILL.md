---
name: parent-child-hierarchical-chunk-retrieval
description: Indexes small, precise child text chunks for retrieval while feeding broad parent sections to the LLM context. Use when balancing retrieval precision with rich contextual synthesis.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.llamaindex.ai/en/stable/examples/node_postprocessor/HierarchicalNodeParser/"
---
# Parent Child Hierarchical Chunk Retrieval

## Overview
Small chunks yield tight vector search matches but lack context for generation. Hierarchical chunking indexes granular child chunks (e.g., 100 tokens) linked to parent blocks (e.g., 1000 tokens).

## Operational Workflow

1. **Parse raw source documents into hierarchical parent chunks (800–1200 tokens).**:
   - Parse raw source documents into hierarchical parent chunks (800–1200 tokens).

2. **Split each parent chunk into multiple smaller child chunks (100–200 tokens) with parent IDs.**:
   - Split each parent chunk into multiple smaller child chunks (100–200 tokens) with parent IDs.

3. **Embed and index child chunks into vector database with metadata pointing to parent chunk ID.**:
   - Embed and index child chunks into vector database with metadata pointing to parent chunk ID.

4. **Upon retrieving matching child chunks, fetch their respective full parent chunks for LLM context.**:
   - Upon retrieving matching child chunks, fetch their respective full parent chunks for LLM context.

## Recommended Tools & Environments
- Hierarchical Chunking
- Parent-Child Node Parser
- LlamaIndex
- Vector Search

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
