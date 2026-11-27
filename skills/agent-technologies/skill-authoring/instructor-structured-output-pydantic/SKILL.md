---
name: instructor-structured-output-pydantic
description: Extracts type-safe, validated Pydantic models from LLM responses with automatic retry loops using Instructor. Use when enforcing strict response typing in Python agent pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/jxnl/instructor"
---
# Instructor Structured Output Pydantic

## Overview
Instructor patches LLM clients to enforce structured output schemas via function calling and response_format, automatically triggering retry prompts when Pydantic validators fail.

## Operational Workflow

1. **Define target response models using Pydantic V2 with field descriptions and validators.**:
   - Define target response models using Pydantic V2 with field descriptions and validators.

2. **Patch client using instructor.from_openai(client) or instructor.from_anthropic().**:
   - Patch client using instructor.from_openai(client) or instructor.from_anthropic().

3. **Execute model generation specifying response_model parameter.**:
   - Execute model generation specifying response_model parameter.

4. **Handle automated validation retries with max_retries backoff parameters.**:
   - Handle automated validation retries with max_retries backoff parameters.

## Recommended Tools & Environments
- Python 3.10+
- Instructor
- Pydantic V2
- OpenAI / Anthropic

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
