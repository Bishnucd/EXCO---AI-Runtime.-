---
name: k6-api-load-performance-testing
description: Authors scalable, scriptable HTTP load testing scenarios with virtual users and latency thresholds using Grafana k6. Use when verifying API performance, capacity limits, and breaking points under load.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://k6.io/docs/"
---
# K6 Api Load Performance Testing

## Overview
Untested APIs collapse during production marketing campaigns. k6 runs high-performance Go-based load simulations executing scriptable virtual user journeys with strict threshold assertions.

## Operational Workflow

1. **Define load testing stages**:
   - Define load testing stages: ramp-up virtual users, sustained plateau stress, and ramp-down.

2. **Script user journeys**:
   - Script user journeys: authentication, search queries, payload submissions, and think-time pauses.

3. **Set strict threshold assertions (e.g. p95 response time < 200ms, error rate < 1%).**:
   - Set strict threshold assertions (e.g. p95 response time < 200ms, error rate < 1%).

4. **Execute tests locally or in distributed CI pipelines, streaming metric telemetry to Grafana.**:
   - Execute tests locally or in distributed CI pipelines, streaming metric telemetry to Grafana.

## Recommended Tools & Environments
- Grafana k6
- JavaScript
- Load Testing
- Prometheus / Grafana

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
