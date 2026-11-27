---
name: hyde-hypothetical-document-embeddings
description: Generates hypothetical answer passages using an LLM to dramatically improve zero-shot dense vector retrieval. Use when user queries are short, ambiguous, or question-phrased.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://arxiv.org/abs/2212.10496"
---
# Hyde Hypothetical Document Embeddings

## Overview
Short questions often lack semantic overlap with long, detailed document passages. HyDE prompts an LLM to hallucinate a hypothetical answer, embedding that passage to retrieve actual matching documents.

## Operational Workflow

1. **Instruct an LLM with zero-shot prompt**:
   - Instruct an LLM with zero-shot prompt: "Write a passage that answers the following question: {query}".

2. **Encode the generated hypothetical document into a dense semantic embedding vector.**:
   - Encode the generated hypothetical document into a dense semantic embedding vector.

3. **Query vector database using the hypothetical document embedding as the search probe.**:
   - Query vector database using the hypothetical document embedding as the search probe.

4. **Feed the retrieved real, fact-checked passages to the final generator LLM.**:
   - Feed the retrieved real, fact-checked passages to the final generator LLM.

## Recommended Tools & Environments
- HyDE
- Dense Retrieval
- Query Expansion
- LangChain / LlamaIndex

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
