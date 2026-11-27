---
name: chaos-mesh-kubernetes-fault-injection-testing
description: Injects network latency, pod kills, and disk I/O errors into Kubernetes test clusters using Chaos Mesh. Use when verifying distributed application resiliency and auto-recovery in staging.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://chaos-mesh.org/docs/"
---
# Chaos Mesh Kubernetes Fault Injection Testing

## Overview
Distributed systems fail unpredictably in production. Chaos Mesh orchestrates fault injection experiments (PodChaos, NetworkChaos, IOChaos) to verify that systems fail over gracefully.

## Operational Workflow

1. **Deploy Chaos Mesh operator to Kubernetes staging cluster using Helm chart.**:
   - Deploy Chaos Mesh operator to Kubernetes staging cluster using Helm chart.

2. **Define Chaos experiment CRD (e.g., NetworkChaos injecting 300ms latency and 20% packet loss to payment service).**:
   - Define Chaos experiment CRD (e.g., NetworkChaos injecting 300ms latency and 20% packet loss to payment service).

3. **Run end-to-end integration test suites while chaos experiment is actively executing.**:
   - Run end-to-end integration test suites while chaos experiment is actively executing.

4. **Verify that circuit breakers, retries, and fallback caches keep application response error rates under 1%.**:
   - Verify that circuit breakers, retries, and fallback caches keep application response error rates under 1%.

## Recommended Tools & Environments
- Chaos Mesh
- Chaos Engineering
- Kubernetes
- Fault Injection

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
