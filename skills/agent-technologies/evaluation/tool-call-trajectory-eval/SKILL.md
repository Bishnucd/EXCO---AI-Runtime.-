---
name: tool-call-trajectory-eval
description: Evaluates agent multi-step tool call execution trajectories for efficiency, parameter correctness, and unnecessary invocations. Use when auditing autonomous tool-using agents for execution precision.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/langchain-ai/langchain"
---
# Tool Call Trajectory Eval

## Overview
Autonomous agents frequently suffer from redundant tool calls, invalid parameter payloads, or cyclic execution loops. Trajectory evaluation scores each decision step against optimal execution graphs.

## Operational Workflow

1. **Capture end-to-end execution trajectories including intermediate tool arguments and raw environment outputs.**:
   - Capture end-to-end execution trajectories including intermediate tool arguments and raw environment outputs.

2. **Validate individual tool arguments against declared JSON schema contracts.**:
   - Validate individual tool arguments against declared JSON schema contracts.

3. **Compare trajectory paths against minimum-cut reference graphs to detect redundant or dead-end tool calls.**:
   - Compare trajectory paths against minimum-cut reference graphs to detect redundant or dead-end tool calls.

4. **Compute trajectory efficiency metrics**:
   - Compute trajectory efficiency metrics: step ratio, argument precision, and error recovery rate.

## Recommended Tools & Environments
- Python 3.10+
- LangChain / LangSmith
- JSON Schema
- Pytest

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
