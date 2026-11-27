---
name: artillery-api-load-benchmarking-pipeline
description: Benchmarks API throughput, latency percentiles (p95/p99), and error rate thresholds using Artillery CLI in CI/CD. Use when verifying that production deployments satisfy performance SLAs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.artillery.io/docs"
---
# Artillery Api Load Benchmarking Pipeline

## Overview
Artillery is a modern, cloud-native load testing toolkit that simulates thousands of concurrent virtual users executing multi-step HTTP, WebSocket, and GraphQL scenarios with YAML specs.

## Operational Workflow

1. **Author load testing script (load-test.yml) defining target URL, phases (warm-up, ramp-up, sustained peak).**:
   - Author load testing script (load-test.yml) defining target URL, phases (warm-up, ramp-up, sustained peak).

2. **Define user scenario requests with JSON extraction and variable capture.**:
   - Define user scenario requests with JSON extraction and variable capture.

3. **Specify strict SLA error and latency thresholds**:
   - Specify strict SLA error and latency thresholds: ensure p99 latency < 250ms and error rate < 0.01%.

4. **Run artillery run load-test.yml in CI pipeline, failing the build automatically if SLAs are breached.**:
   - Run artillery run load-test.yml in CI pipeline, failing the build automatically if SLAs are breached.

## Recommended Tools & Environments
- Artillery
- Load Testing
- Latency Benchmarking
- CI/CD Performance Gate

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
