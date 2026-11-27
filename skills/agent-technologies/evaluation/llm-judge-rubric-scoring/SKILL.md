---
name: llm-judge-rubric-scoring
description: Implements an automated LLM-as-a-judge evaluation harness using structured rubrics and calibration test sets. Use when evaluating generative agent response quality, safety, and coherence at scale.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/huggingface/lighteval"
---
# Llm Judge Rubric Scoring

## Overview
Automated evaluation using a secondary high-capacity language model as a judge requires deterministic rubric scoring, multi-turn reasoning calibration, and score normalization to prevent self-enhancement bias.

## Operational Workflow

1. **Define multidimensional evaluation rubrics with explicit 1-5 rating criteria and anchor examples.**:
   - Define multidimensional evaluation rubrics with explicit 1-5 rating criteria and anchor examples.

2. **Construct evaluation prompts enforcing chain-of-thought justification before emitting numeric scores.**:
   - Construct evaluation prompts enforcing chain-of-thought justification before emitting numeric scores.

3. **Calibrate the judge against a golden human-annotated dataset, computing Spearman and Pearson correlations.**:
   - Calibrate the judge against a golden human-annotated dataset, computing Spearman and Pearson correlations.

4. **Execute batch evaluations across agent response trajectories and aggregate statistical percentiles (p50, p95).**:
   - Execute batch evaluations across agent response trajectories and aggregate statistical percentiles (p50, p95).

## Recommended Tools & Environments
- Python 3.10+
- OpenAI API / Anthropic API
- Pydantic
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
