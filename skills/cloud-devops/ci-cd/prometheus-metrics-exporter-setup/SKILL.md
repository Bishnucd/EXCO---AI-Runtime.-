---
name: prometheus-metrics-exporter-setup
description: Instruments applications and infrastructure services to expose Prometheus metrics with standard labels. Use when adding real-time telemetry and alerting to distributed services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://prometheus.io/docs/practices/instrumentation/"
---
# Prometheus Metrics Exporter Setup

## Overview
Reliable observability relies on RED metrics (Rate, Errors, Duration). Exposing /metrics endpoints with uniform labels enables real-time Grafana dashboards and Prometheus alerts.

## Operational Workflow

1. **Initialize Prometheus client library and register counter, gauge, and histogram metric types.**:
   - Initialize Prometheus client library and register counter, gauge, and histogram metric types.

2. **Expose authenticated or internal /metrics endpoint returning text/plain Prometheus format.**:
   - Expose authenticated or internal /metrics endpoint returning text/plain Prometheus format.

3. **Instrument HTTP middleware to record request counts, status codes, and latency distributions.**:
   - Instrument HTTP middleware to record request counts, status codes, and latency distributions.

4. **Configure Prometheus scrape jobs and alert rules for error rate spikes and latency degradation.**:
   - Configure Prometheus scrape jobs and alert rules for error rate spikes and latency degradation.

## Recommended Tools & Environments
- Prometheus
- Grafana
- PromQL
- OpenTelemetry

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
