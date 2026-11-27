---
name: trulens-feedback-evaluator
description: Evaluates the RAG triad (groundedness, answer relevance, context relevance) using TruLens feedback functions. Use when measuring hallucination and retrieval relevance in agents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/truera/trulens"
---
# Trulens Feedback Evaluator

## Overview
TruLens instruments agent applications with feedback functions that objectively measure the RAG triad to isolate whether failures occur during retrieval or generation.

## Operational Workflow

1. **Wrap agent chain with TruChain or TruCustomApp recorder instrumentation.**:
   - Wrap agent chain with TruChain or TruCustomApp recorder instrumentation.

2. **Define feedback functions measuring context relevance, groundedness, and answer relevance.**:
   - Define feedback functions measuring context relevance, groundedness, and answer relevance.

3. **Execute queries across test benchmark datasets while capturing execution traces.**:
   - Execute queries across test benchmark datasets while capturing execution traces.

4. **Launch TruLens dashboard to inspect leaderboard metrics and pinpoint failing trace spans.**:
   - Launch TruLens dashboard to inspect leaderboard metrics and pinpoint failing trace spans.

## Recommended Tools & Environments
- Python 3.10+
- TruLens
- LangChain / LlamaIndex
- SQLite / Postgres

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
