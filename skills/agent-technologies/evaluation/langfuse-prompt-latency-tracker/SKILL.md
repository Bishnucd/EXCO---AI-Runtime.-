---
name: langfuse-prompt-latency-tracker
description: Monitors LLM generation latency, token counts, and cost metrics across production sessions using Langfuse. Use when profiling production agent performance and user feedback.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/langfuse/langfuse"
---
# Langfuse Prompt Latency Tracker

## Overview
Langfuse is an open-source LLM engineering platform offering tracing, prompt management, evaluation, and fine-grained token/cost analytics for production AI applications.

## Operational Workflow

1. **Wrap LLM client with Langfuse SDK and capture multi-turn conversation session IDs.**:
   - Wrap LLM client with Langfuse SDK and capture multi-turn conversation session IDs.

2. **Log user feedback scores (thumbs up/down) directly attached to specific generation trace IDs.**:
   - Log user feedback scores (thumbs up/down) directly attached to specific generation trace IDs.

3. **Configure prompt management to decouple production prompt templates from application deployments.**:
   - Configure prompt management to decouple production prompt templates from application deployments.

4. **Inspect production latency percentiles (p50, p90, p99) and token spend breakdowns by user tier.**:
   - Inspect production latency percentiles (p50, p90, p99) and token spend breakdowns by user tier.

## Recommended Tools & Environments
- Langfuse SDK
- TypeScript / Python
- Postgres
- Docker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
