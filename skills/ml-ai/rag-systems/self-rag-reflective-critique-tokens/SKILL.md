---
name: self-rag-reflective-critique-tokens
description: Implements Self-RAG reflection tokens ([Retrieve], [IsRel], [IsSup], [IsUse]) for autonomous self-correcting RAG. Use when preventing hallucinations through adaptive retrieval and critique.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/AkariAsai/self-rag"
---
# Self Rag Reflective Critique Tokens

## Overview
Self-RAG trains models to generate special reflection tokens to decide dynamically whether retrieval is needed, judge retrieved passage relevance, and critique factual consistency.

## Operational Workflow

1. **Prompt model to evaluate input query and emit [Retrieve] token only if external knowledge is required.**:
   - Prompt model to evaluate input query and emit [Retrieve] token only if external knowledge is required.

2. **Retrieve top candidate passages from external vector or document repository.**:
   - Retrieve top candidate passages from external vector or document repository.

3. **Model critiques each candidate passage with [IsRel] (Relevant / Irrelevant) score token.**:
   - Model critiques each candidate passage with [IsRel] (Relevant / Irrelevant) score token.

4. **Generate response conditioned on relevant passages and verify with [IsSup] (Supported) token.**:
   - Generate response conditioned on relevant passages and verify with [IsSup] (Supported) token.

## Recommended Tools & Environments
- Self-RAG
- Reflection Tokens
- Adaptive Retrieval
- Hallucination Mitigation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
