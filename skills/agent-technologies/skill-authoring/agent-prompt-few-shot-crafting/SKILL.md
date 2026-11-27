---
name: agent-prompt-few-shot-crafting
description: Designs high-leverage few-shot prompt exemplars that guide agent reasoning and tool usage patterns. Use when tuning system prompts to improve agent task completion rates.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://arxiv.org/abs/2201.11903"
---
# Agent Prompt Few Shot Crafting

## Overview
Few-shot demonstration exemplars provide inductive bias that guides agent reasoning chains, tool selection logic, and error recovery behavior far more reliably than abstract instructions.

## Operational Workflow

1. **Identify critical failure modes and ambiguous edge cases in baseline agent runs.**:
   - Identify critical failure modes and ambiguous edge cases in baseline agent runs.

2. **Draft input-thought-action-observation exemplars demonstrating correct intermediate decisions.**:
   - Draft input-thought-action-observation exemplars demonstrating correct intermediate decisions.

3. **Include negative examples illustrating common traps and their explicit correction steps.**:
   - Include negative examples illustrating common traps and their explicit correction steps.

4. **Evaluate token overhead versus accuracy improvements across diverse test distributions.**:
   - Evaluate token overhead versus accuracy improvements across diverse test distributions.

## Recommended Tools & Environments
- Markdown
- Prompt Engineering
- YAML
- Jinja2

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
