---
name: wandb-weave-trace-evaluator
description: Traces and evaluates LLM application pipelines, prompts, and datasets using Weights & Biases Weave. Use when tracking agent iterations and scoring evaluation datasets in team workflows.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/wandb/weave"
---
# Wandb Weave Trace Evaluator

## Overview
Weave provides lightweight, type-safe tracking and evaluation for LLM applications, logging function calls with zero configuration and visualizing evaluation score distributions.

## Operational Workflow

1. **Initialize weave.init() and apply @weave.op() decorator to agent pipeline functions.**:
   - Initialize weave.init() and apply @weave.op() decorator to agent pipeline functions.

2. **Publish evaluation dataset to Weave containing test inputs and reference outputs.**:
   - Publish evaluation dataset to Weave containing test inputs and reference outputs.

3. **Define Model class and Evaluation scorer functions (e.g. latency, exact match, LLM judge).**:
   - Define Model class and Evaluation scorer functions (e.g. latency, exact match, LLM judge).

4. **Execute weave.Evaluation and inspect side-by-side metric dashboards on W&B.**:
   - Execute weave.Evaluation and inspect side-by-side metric dashboards on W&B.

## Recommended Tools & Environments
- W&B Weave
- Python 3.10+
- Weights & Biases
- OpenAI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
