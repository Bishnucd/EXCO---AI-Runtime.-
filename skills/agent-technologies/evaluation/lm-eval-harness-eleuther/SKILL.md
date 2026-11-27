---
name: lm-eval-harness-eleuther
description: Benchmarks foundational language models across standard academic datasets using EleutherAI LM Evaluation Harness. Use when evaluating base model reasoning capabilities.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/EleutherAI/lm-evaluation-harness"
---
# Lm Eval Harness Eleuther

## Overview
The EleutherAI LM Evaluation Harness is the gold standard benchmark suite for evaluating language models on MMLU, GSM8K, HellaSwag, and ARC reasoning tasks.

## Operational Workflow

1. **Install lm-eval package and configure target model endpoint or local HuggingFace weights.**:
   - Install lm-eval package and configure target model endpoint or local HuggingFace weights.

2. **Select evaluation tasks**:
   - Select evaluation tasks: mmlu, gsm8k, hellaswag, arc_challenge.

3. **Execute evaluation harness specifying few-shot parameters and batch sizes.**:
   - Execute evaluation harness specifying few-shot parameters and batch sizes.

4. **Export standardized benchmark JSON metrics detailing accuracy, normalized accuracy, and perplexity.**:
   - Export standardized benchmark JSON metrics detailing accuracy, normalized accuracy, and perplexity.

## Recommended Tools & Environments
- Python 3.10+
- lm-eval CLI
- PyTorch
- HuggingFace

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
