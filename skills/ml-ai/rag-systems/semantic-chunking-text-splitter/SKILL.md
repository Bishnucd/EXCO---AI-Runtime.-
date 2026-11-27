---
name: semantic-chunking-text-splitter
description: Partitions documents into semantically coherent chunks based on embedding similarity distance between adjacent sentences. Use when preparing unstructured text documents for vector search indexing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://python.langchain.com/docs/modules/data_connection/document_transformers/semantic-chunker/"
---
# Semantic Chunking Text Splitter

## Overview
Fixed-character chunking splits sentences in half and tears paragraphs apart. Semantic chunking computes embedding distance between adjacent sentences and splits text only at natural topic transitions.

## Operational Workflow

1. **Segment raw source document into atomic sentences using linguistic sentence boundary detectors.**:
   - Segment raw source document into atomic sentences using linguistic sentence boundary detectors.

2. **Compute vector embeddings for each consecutive sentence in the document.**:
   - Compute vector embeddings for each consecutive sentence in the document.

3. **Calculate cosine distance between consecutive sentence embeddings.**:
   - Calculate cosine distance between consecutive sentence embeddings.

4. **Place chunk boundaries where semantic distance exceeds statistical percentile thresholds (e.g. 95th percentile).**:
   - Place chunk boundaries where semantic distance exceeds statistical percentile thresholds (e.g. 95th percentile).

## Recommended Tools & Environments
- Python 3.10+
- LangChain
- Sentence-Transformers
- NumPy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
