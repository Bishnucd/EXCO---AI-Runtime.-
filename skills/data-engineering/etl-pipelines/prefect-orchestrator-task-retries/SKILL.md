---
name: prefect-orchestrator-task-retries
description: Orchestrates complex data workflows with dynamic task dependencies, retries, and failure alerts using Prefect 3.x. Use when building resilient Python data workflows without heavyweight infrastructure.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.prefect.io/"
---
# Prefect Orchestrator Task Retries

## Overview
Prefect coordinates modern Python data stacks with code-as-configuration flows, automatic exponential backoff retries, concurrency limits, and native async/await support.

## Operational Workflow

1. **Decorate Python processing functions with @task(retries=3, retry_delay_seconds=30).**:
   - Decorate Python processing functions with @task(retries=3, retry_delay_seconds=30).

2. **Assemble task functions into master @flow pipeline with parameter validation.**:
   - Assemble task functions into master @flow pipeline with parameter validation.

3. **Configure task concurrency slots to avoid overwhelming upstream database connections.**:
   - Configure task concurrency slots to avoid overwhelming upstream database connections.

4. **Deploy flow to Prefect worker pools with automated Slack notifications on failure states.**:
   - Deploy flow to Prefect worker pools with automated Slack notifications on failure states.

## Recommended Tools & Environments
- Prefect
- Python
- Workflow Orchestration
- Cloud Infrastructure

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
