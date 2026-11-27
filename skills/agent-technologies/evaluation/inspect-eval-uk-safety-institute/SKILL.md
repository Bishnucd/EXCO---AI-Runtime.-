---
name: inspect-eval-uk-safety-institute
description: Executes frontier model capability and safety evaluations using the UK AI Safety Institute Inspect framework. Use when evaluating agent autonomous capabilities and safety boundaries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/UKGovernmentBEIS/inspect_ai"
---
# Inspect Eval Uk Safety Institute

## Overview
Inspect is an open-source evaluation framework created by the UK AI Safety Institute for evaluating model reasoning, coding agent autonomy, and cyber capabilities in sandboxes.

## Operational Workflow

1. **Define Inspect Eval tasks specifying dataset, solver plan, and scoring metrics.**:
   - Define Inspect Eval tasks specifying dataset, solver plan, and scoring metrics.

2. **Configure sandboxed execution environments using Docker container backends.**:
   - Configure sandboxed execution environments using Docker container backends.

3. **Execute agent task trajectories and log intermediate actions and tool calls.**:
   - Execute agent task trajectories and log intermediate actions and tool calls.

4. **Review interactive Inspect visualizer logs to audit autonomous agent behavior.**:
   - Review interactive Inspect visualizer logs to audit autonomous agent behavior.

## Recommended Tools & Environments
- Inspect AI
- Python 3.10+
- Sandboxed Docker
- JSON Schema

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
