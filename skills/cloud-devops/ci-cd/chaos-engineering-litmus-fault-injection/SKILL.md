---
name: chaos-engineering-litmus-fault-injection
description: Executes automated chaos engineering experiments (pod kill, network latency, CPU hogging) using LitmusChaos. Use when validating high-availability and fault resilience in Kubernetes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://litmuschaos.io/"
---
# Chaos Engineering Litmus Fault Injection

## Overview
Untested failovers fail during real outages. Chaos engineering deliberately injects failures (killing random pods, adding 500ms network packet latency) to prove systems survive unexpected degradation.

## Operational Workflow

1. **Deploy LitmusChaos Operator and configure ChaosEngine resource targeting application pods.**:
   - Deploy LitmusChaos Operator and configure ChaosEngine resource targeting application pods.

2. **Define steady-state hypothesis**:
   - Define steady-state hypothesis: application endpoint must return HTTP 200 with latency < 300ms.

3. **Execute chaos experiment**:
   - Execute chaos experiment: terminate primary database pod or corrupt network packets.

4. **Verify that Kubernetes autoscaling and pod replicas maintain continuous service availability.**:
   - Verify that Kubernetes autoscaling and pod replicas maintain continuous service availability.

## Recommended Tools & Environments
- LitmusChaos
- Chaos Engineering
- Kubernetes
- Cloud Resilience

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
