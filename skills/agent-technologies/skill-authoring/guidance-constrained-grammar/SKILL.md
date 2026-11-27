---
name: guidance-constrained-grammar
description: Authors interleaved generation and constraint templates for language models using the Guidance framework. Use when controlling complex generation flows with precise token boundaries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/guidance-ai/guidance"
---
# Guidance Constrained Grammar

## Overview
Guidance combines prompt generation and structured constraints into single executable programs, interleaving static strings, regex selections, and model sampling seamlessly.

## Operational Workflow

1. **Load model into Guidance runtime context.**:
   - Load model into Guidance runtime context.

2. **Author template programs with select(), gen(), and substring constraints.**:
   - Author template programs with select(), gen(), and substring constraints.

3. **Execute program**:
   - Execute program: static characters are forced instantly without model inference overhead.

4. **Capture structured dictionary outputs directly from captured variable tags.**:
   - Capture structured dictionary outputs directly from captured variable tags.

## Recommended Tools & Environments
- Guidance
- Python 3.10+
- Llama.cpp / Transformers
- Grammar

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
