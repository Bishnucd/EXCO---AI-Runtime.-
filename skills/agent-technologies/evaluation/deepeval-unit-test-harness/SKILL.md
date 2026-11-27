---
name: deepeval-unit-test-harness
description: Implements automated unit test suites for LLM applications and agents using DeepEval. Use when running continuous integration regression tests on agent output quality.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/confident-ai/deepeval"
---
# Deepeval Unit Test Harness

## Overview
DeepEval brings standard software unit testing discipline to LLM evaluation, running deterministic assertions and G-Eval metrics directly within Pytest pipelines.

## Operational Workflow

1. **Define test cases specifying input prompt, expected output, and actual model response.**:
   - Define test cases specifying input prompt, expected output, and actual model response.

2. **Configure G-Eval metric scoring with custom evaluation criteria and threshold limits.**:
   - Configure G-Eval metric scoring with custom evaluation criteria and threshold limits.

3. **Execute tests in headless CI/CD runners using pytest integration.**:
   - Execute tests in headless CI/CD runners using pytest integration.

4. **Generate automated test pass/fail reports with detailed failure diagnostics.**:
   - Generate automated test pass/fail reports with detailed failure diagnostics.

## Recommended Tools & Environments
- Python 3.10+
- DeepEval
- Pytest
- OpenAI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
