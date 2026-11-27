---
name: health-check-liveness-readiness-probes
description: Designs Kubernetes-compliant /healthz and /readyz endpoints with deep database and cache dependency probes. Use when ensuring zero-downtime rolling deployments in container orchestrators.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/"
---
# Health Check Liveness Readiness Probes

## Overview
Liveness probes check if a process is frozen (requiring restart). Readiness probes check if dependencies (database, Redis) are reachable (ready to accept traffic). Confusing them causes cascading outages.

## Operational Workflow

1. **Implement /healthz (liveness probe)**:
   - Implement /healthz (liveness probe): return 200 OK if server process event loop is responsive.

2. **Implement /readyz (readiness probe)**:
   - Implement /readyz (readiness probe): execute quick ping queries against database and cache pools.

3. **Return 503 Service Unavailable on /readyz if database connections are exhausted or warming up.**:
   - Return 503 Service Unavailable on /readyz if database connections are exhausted or warming up.

4. **Configure Kubernetes deployment YAML with initialDelaySeconds, periodSeconds, and timeoutSeconds.**:
   - Configure Kubernetes deployment YAML with initialDelaySeconds, periodSeconds, and timeoutSeconds.

## Recommended Tools & Environments
- Health Checks
- Liveness / Readiness Probes
- Kubernetes
- High Availability

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
