---
name: grafana-tempo-distributed-tracing-backend
description: Deploys and configures high-volume, object-storage-backed distributed tracing using Grafana Tempo and OpenTelemetry. Use when storing billions of trace spans cost-effectively.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://grafana.com/docs/tempo/latest/"
---
# Grafana Tempo Distributed Tracing Backend

## Overview
Storing trace spans in Elasticsearch or Cassandra is prohibitively expensive at scale. Grafana Tempo stores complete distributed traces directly in cloud object storage (S3), reducing storage costs by 90%.

## Operational Workflow

1. **Deploy Grafana Tempo distributed microservices architecture (distributor, ingester, querier).**:
   - Deploy Grafana Tempo distributed microservices architecture (distributor, ingester, querier).

2. **Configure S3 or Google Cloud Storage bucket backend for immutable trace block storage.**:
   - Configure S3 or Google Cloud Storage bucket backend for immutable trace block storage.

3. **Configure OpenTelemetry Collector to export OTLP traces to Tempo ingestion endpoints.**:
   - Configure OpenTelemetry Collector to export OTLP traces to Tempo ingestion endpoints.

4. **Link Grafana dashboards from Loki logs and Prometheus metrics directly into corresponding Tempo traces.**:
   - Link Grafana dashboards from Loki logs and Prometheus metrics directly into corresponding Tempo traces.

## Recommended Tools & Environments
- Grafana Tempo
- OpenTelemetry Collector
- AWS S3 / GCS
- Grafana

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
