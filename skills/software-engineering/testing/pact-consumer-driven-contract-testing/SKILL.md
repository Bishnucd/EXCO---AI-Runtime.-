---
name: pact-consumer-driven-contract-testing
description: Defines and verifies consumer-driven API contracts between microservices using Pact. Use when catching breaking API changes between frontend and backend teams before deployment.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.pact.io/"
---
# Pact Consumer Driven Contract Testing

## Overview
End-to-end testing of 50 microservices is slow and flaky. Pact allows API consumers to write unit tests generating a contract JSON, which the provider service verifies independently in CI.

## Operational Workflow

1. **Author consumer test defining expected request and response payload structure using Pact DSL.**:
   - Author consumer test defining expected request and response payload structure using Pact DSL.

2. **Execute consumer test to generate signed contract file (pact.json) and publish to Pact Broker.**:
   - Execute consumer test to generate signed contract file (pact.json) and publish to Pact Broker.

3. **Trigger provider verification job**:
   - Trigger provider verification job: provider replays recorded consumer requests against its endpoints.

4. **Run pact-broker can-i-deploy in CI to verify all contracts pass before deploying microservice.**:
   - Run pact-broker can-i-deploy in CI to verify all contracts pass before deploying microservice.

## Recommended Tools & Environments
- Pact
- Consumer-Driven Contracts
- Microservices
- API Contract Testing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
