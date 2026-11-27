---
name: pact-consumer-driven-contract-test
description: Implements consumer-driven contract testing between microservices using Pact to prevent breaking API changes. Use when testing distributed service integrations without fragile end-to-end environments.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.pact.io/"
---
# Pact Consumer Driven Contract Test

## Overview
End-to-end integration environments are slow and brittle. Consumer-driven contracts allow API consumers to publish expected request/response contracts that provider services verify in CI.

## Operational Workflow

1. **Define consumer expectations (HTTP method, path, headers, request/response body schemas).**:
   - Define consumer expectations (HTTP method, path, headers, request/response body schemas).

2. **Run consumer test suite to generate verified Pact contract JSON artifacts.**:
   - Run consumer test suite to generate verified Pact contract JSON artifacts.

3. **Publish contract files to central Pact Broker.**:
   - Publish contract files to central Pact Broker.

4. **Execute provider verification in provider CI**:
   - Execute provider verification in provider CI: replay consumer interactions against provider code and assert compliance.

## Recommended Tools & Environments
- Pact
- Node.js / Python / Java
- JSON Contracts
- Pact Broker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
