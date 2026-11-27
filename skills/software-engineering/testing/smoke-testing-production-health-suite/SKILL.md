---
name: smoke-testing-production-health-suite
description: Executes post-deployment smoke test suites against live production endpoints to verify critical user journeys. Use when validating zero-downtime deployments before routing full traffic.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Smoke_testing_(software)"
---
# Smoke Testing Production Health Suite

## Overview
Smoke tests run a minimal set of critical end-to-end checks against freshly deployed production instances, verifying database connectivity, auth flows, and core payment paths before traffic cutover.

## Operational Workflow

1. **Define non-destructive critical user journey test suite (health check, user login, catalog search).**:
   - Define non-destructive critical user journey test suite (health check, user login, catalog search).

2. **Execute smoke test runner against newly deployed green container cluster or canary deployment.**:
   - Execute smoke test runner against newly deployed green container cluster or canary deployment.

3. **Verify that all HTTP status codes return 200 OK and database read/write checks succeed.**:
   - Verify that all HTTP status codes return 200 OK and database read/write checks succeed.

4. **If smoke tests fail, automatically abort canary rollout and trigger instant rollback to previous version.**:
   - If smoke tests fail, automatically abort canary rollout and trigger instant rollback to previous version.

## Recommended Tools & Environments
- Smoke Testing
- Post-Deployment Verification
- Synthetic Monitoring
- Health Checks

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
