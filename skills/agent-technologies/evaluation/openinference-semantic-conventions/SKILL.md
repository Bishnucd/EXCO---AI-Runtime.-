---
name: openinference-semantic-conventions
description: Instruments AI applications with OpenInference semantic telemetry conventions for standardized OpenTelemetry traces. Use when standardizing LLM observability across heterogeneous tools.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/Arize-ai/openinference"
---
# Openinference Semantic Conventions

## Overview
OpenInference defines vendor-neutral semantic conventions for tracing LLMs, vector stores, retrievers, and embedding models, avoiding lock-in to proprietary tracing formats.

## Operational Workflow

1. **Install openinference-instrumentation packages for target frameworks (LangChain, LlamaIndex, DSPy).**:
   - Install openinference-instrumentation packages for target frameworks (LangChain, LlamaIndex, DSPy).

2. **Initialize TracerProvider emitting spans adhering to OpenInference semantic attributes.**:
   - Initialize TracerProvider emitting spans adhering to OpenInference semantic attributes.

3. **Record standardized span attributes (llm.input_messages, llm.output_messages, embedding.vector).**:
   - Record standardized span attributes (llm.input_messages, llm.output_messages, embedding.vector).

4. **Export traces to any standard OTel-compatible backend (Phoenix, Datadog, Honeycomb).**:
   - Export traces to any standard OTel-compatible backend (Phoenix, Datadog, Honeycomb).

## Recommended Tools & Environments
- OpenInference
- OpenTelemetry
- Python / JavaScript
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
