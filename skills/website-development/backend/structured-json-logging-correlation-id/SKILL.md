---
name: structured-json-logging-correlation-id
description: Implements structured JSON logging with distributed correlation and request ID propagation across microservices. Use when tracing requests across distributed backend microservice architectures.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://opentelemetry.io/docs/concepts/signals/logs/"
---
# Structured Json Logging Correlation Id

## Overview
Unstructured string logs are impossible to query across hundreds of containers. Structured JSON logging attaches timestamp, log level, message, user_id, and correlation_id to every log entry.

## Operational Workflow

1. **Extract incoming x-correlation-id header from HTTP request or generate a new UUID.**:
   - Extract incoming x-correlation-id header from HTTP request or generate a new UUID.

2. **Store correlation ID in async context storage (AsyncLocalStorage in Node.js, contextvars in Python).**:
   - Store correlation ID in async context storage (AsyncLocalStorage in Node.js, contextvars in Python).

3. **Configure logging formatter to emit machine-readable single-line JSON records.**:
   - Configure logging formatter to emit machine-readable single-line JSON records.

4. **Propagate x-correlation-id header on all outbound HTTP and gRPC calls to downstream microservices.**:
   - Propagate x-correlation-id header on all outbound HTTP and gRPC calls to downstream microservices.

## Recommended Tools & Environments
- Structured Logging
- Correlation IDs
- Winston / Loguru
- Distributed Systems

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
