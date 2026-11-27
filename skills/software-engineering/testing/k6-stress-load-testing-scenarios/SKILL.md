---
name: k6-stress-load-testing-scenarios
description: Simulates high-concurrency peak load, ramp-up, and soak tests using Grafana k6 in JavaScript. Use when validating system throughput limits and auto-scaling behavior under stress.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://k6.io/docs/"
---
# K6 Stress Load Testing Scenarios

## Overview
k6 is a developer-centric load testing tool written in Go that runs ES6 JavaScript test scripts, generating high-volume concurrent traffic with low CPU and memory footprint.

## Operational Workflow

1. **Write load test script in JavaScript defining options.scenarios (ramping-vus, constant-arrival-rate).**:
   - Write load test script in JavaScript defining options.scenarios (ramping-vus, constant-arrival-rate).

2. **Implement default user flow function**:
   - Implement default user flow function: make HTTP requests and check assertions with check().

3. **Define thresholds**:
   - Define thresholds: http_req_duration: ["p(95)<300"], http_req_failed: ["rate<0.01"].

4. **Execute k6 run load-test.js and stream metrics to Grafana dashboard for real-time visualization.**:
   - Execute k6 run load-test.js and stream metrics to Grafana dashboard for real-time visualization.

## Recommended Tools & Environments
- k6
- Grafana k6
- Load Testing
- Performance Engineering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
