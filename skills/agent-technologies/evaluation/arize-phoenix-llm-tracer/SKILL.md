---
name: arize-phoenix-llm-tracer
description: Traces agent tool execution, retrieval spans, and latency bottlenecks using OpenTelemetry and Arize Phoenix. Use when debugging complex multi-agent execution graphs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/Arize-ai/phoenix"
---
# Arize Phoenix Llm Tracer

## Overview
Arize Phoenix is an open-source AI observability platform providing execution graph visualization, vector clustering, and evaluation analysis for agent workflows.

## Operational Workflow

1. **Initialize Phoenix tracer provider with OpenTelemetry auto-instrumentation.**:
   - Initialize Phoenix tracer provider with OpenTelemetry auto-instrumentation.

2. **Trace multi-step agent decisions, intermediate tool inputs, and raw environment returns.**:
   - Trace multi-step agent decisions, intermediate tool inputs, and raw environment returns.

3. **Inspect waterfall span visualizations to isolate execution latency bottlenecks.**:
   - Inspect waterfall span visualizations to isolate execution latency bottlenecks.

4. **Cluster embeddings to detect out-of-distribution user query drifts.**:
   - Cluster embeddings to detect out-of-distribution user query drifts.

## Recommended Tools & Environments
- Arize Phoenix
- OpenTelemetry
- Python 3.10+
- FastAPI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
