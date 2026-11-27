---
name: ragas-synthetic-evaluation-metrics
description: Evaluates RAG retrieval and generation quality using Ragas metrics (Faithfulness, Answer Relevance, Context Recall). Use when benchmarking and tuning RAG retrieval and generation accuracy.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.ragas.io/en/latest/"
---
# Ragas Synthetic Evaluation Metrics

## Overview
Ragas provides reference-free evaluation metrics for RAG architectures. It quantifies hallucination (faithfulness), query alignment (answer relevance), and retrieval recall (context precision).

## Operational Workflow

1. **Generate or curate a golden evaluation dataset with user queries, ground truth, and source documents.**:
   - Generate or curate a golden evaluation dataset with user queries, ground truth, and source documents.

2. **Run queries through target RAG pipeline and capture retrieved context chunks and generated answers.**:
   - Run queries through target RAG pipeline and capture retrieved context chunks and generated answers.

3. **Compute Ragas metric suite**:
   - Compute Ragas metric suite: faithfulness, answer_relevancy, context_precision, and context_recall.

4. **Analyze failure distributions and adjust chunk sizes, retrieval top-k, or prompt instructions accordingly.**:
   - Analyze failure distributions and adjust chunk sizes, retrieval top-k, or prompt instructions accordingly.

## Recommended Tools & Environments
- Python 3.10+
- Ragas
- LangChain / LlamaIndex
- OpenAI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
