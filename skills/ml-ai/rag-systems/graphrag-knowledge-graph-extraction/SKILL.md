---
name: graphrag-knowledge-graph-extraction
description: Extracts entities, relationships, and hierarchical community summaries from text corpora using Microsoft GraphRAG. Use when answering complex holistic questions across large document sets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://microsoft.github.io/graphrag/"
---
# Graphrag Knowledge Graph Extraction

## Overview
Microsoft GraphRAG combines LLM-driven knowledge graph extraction with hierarchical graph clustering algorithms to synthesize broad corpus-level themes that vector similarity search misses.

## Operational Workflow

1. **Partition source documents into text chunks and prompt LLMs to extract entity and relationship tuples.**:
   - Partition source documents into text chunks and prompt LLMs to extract entity and relationship tuples.

2. **Construct network graph and apply Leiden community detection to discover hierarchical entity clusters.**:
   - Construct network graph and apply Leiden community detection to discover hierarchical entity clusters.

3. **Generate natural language community summaries summarizing themes for each graph cluster level.**:
   - Generate natural language community summaries summarizing themes for each graph cluster level.

4. **Execute global search over community summaries or local search traversing entity neighborhood graphs.**:
   - Execute global search over community summaries or local search traversing entity neighborhood graphs.

## Recommended Tools & Environments
- Microsoft GraphRAG
- Knowledge Graphs
- Hierarchical Summarization
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
