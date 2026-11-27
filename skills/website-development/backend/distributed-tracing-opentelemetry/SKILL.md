---
name: distributed-tracing-opentelemetry
description: Instruments distributed microservices with OpenTelemetry SDK to trace requests across service boundaries. Use when monitoring distributed transaction latency and pinpointing bottlenecks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://opentelemetry.io/docs/concepts/signals/traces/"
---
# Distributed Tracing Opentelemetry

## Overview
Tracking requests across microservices is impossible without distributed tracing. OpenTelemetry propagates W3C traceparent headers across HTTP and gRPC calls, assembling complete waterfall spans.

## Operational Workflow

1. **Initialize OpenTelemetry TracerProvider with OTLP exporter pointing to Jaeger or collector.**:
   - Initialize OpenTelemetry TracerProvider with OTLP exporter pointing to Jaeger or collector.

2. **Enable auto-instrumentation for HTTP, Express, PostgreSQL, and Redis libraries.**:
   - Enable auto-instrumentation for HTTP, Express, PostgreSQL, and Redis libraries.

3. **Propagate W3C Trace Context headers (traceparent) across outbound HTTP client requests.**:
   - Propagate W3C Trace Context headers (traceparent) across outbound HTTP client requests.

4. **Create custom spans with domain attributes for critical business transactions.**:
   - Create custom spans with domain attributes for critical business transactions.

## Recommended Tools & Environments
- OpenTelemetry (OTel)
- W3C Trace Context
- Jaeger
- Node.js / Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
