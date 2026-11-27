---
name: locust-python-distributed-load-testing
description: Writes scalable, code-driven user load testing scenarios in pure Python using Locust. Use when simulating complex user behavior and distributed traffic generation across worker machines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.locust.io/"
---
# Locust Python Distributed Load Testing

## Overview
Locust avoids clunky XML/GUI configuration by letting developers define user behavior as plain Python code with @task decorators, coordinating worker nodes over ZeroMQ to simulate millions of users.

## Operational Workflow

1. **Define HttpUser subclass specifying wait_time intervals between sequential actions.**:
   - Define HttpUser subclass specifying wait_time intervals between sequential actions.

2. **Implement task methods (@task) executing HTTP requests, checking response assertions, and logging metrics.**:
   - Implement task methods (@task) executing HTTP requests, checking response assertions, and logging metrics.

3. **Launch Locust master and worker processes across distributed Kubernetes pods or VMs.**:
   - Launch Locust master and worker processes across distributed Kubernetes pods or VMs.

4. **Monitor real-time web dashboard displaying RPS (requests per second), failure rates, and response time percentiles.**:
   - Monitor real-time web dashboard displaying RPS (requests per second), failure rates, and response time percentiles.

## Recommended Tools & Environments
- Locust
- Python
- Distributed Load Testing
- Performance Engineering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
