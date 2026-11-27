---
name: ragas-context-precision-eval
description: Calculates Context Precision and Context Recall metrics using Ragas to isolate retrieval failure points. Use when optimizing vector search chunking and retrieval parameters.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/explodinggradients/ragas"
---
# Ragas Context Precision Eval

## Overview
Context Precision evaluates whether all ground-truth relevant items in the retrieved context are ranked at the top. Measuring it isolates whether RAG issues are caused by retrieval ranking.

## Operational Workflow

1. **Assemble test dataset with question, reference context, and retrieved context chunks.**:
   - Assemble test dataset with question, reference context, and retrieved context chunks.

2. **Execute Ragas context_precision and context_recall evaluation metrics.**:
   - Execute Ragas context_precision and context_recall evaluation metrics.

3. **Calculate Mean Average Precision (MAP) across retrieval candidate ranks.**:
   - Calculate Mean Average Precision (MAP) across retrieval candidate ranks.

4. **Adjust reranker thresholds or embedding chunk sizes to maximize top-ranked precision.**:
   - Adjust reranker thresholds or embedding chunk sizes to maximize top-ranked precision.

## Recommended Tools & Environments
- Python 3.10+
- Ragas
- LangChain
- NumPy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
