---
name: mockserver-dynamic-expectation-verification
description: Verifies outbound microservice HTTP/HTTPS requests and simulates dynamic callbacks using MockServer. Use when asserting that internal services make correct outbound webhook and API calls.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.mock-server.com/"
---
# Mockserver Dynamic Expectation Verification

## Overview
Standard mock servers only return responses. MockServer records all incoming HTTP requests, allowing tests to verify exact outbound headers, payloads, and request frequencies made by tested services.

## Operational Workflow

1. **Start MockServer instance in test environment via Docker or Java client.**:
   - Start MockServer instance in test environment via Docker or Java client.

2. **Configure expectation**:
   - Configure expectation: when request matches path /api/v1/charge, respond with status 200 and transaction ID.

3. **Trigger business logic in application under test.**:
   - Trigger business logic in application under test.

4. **Verify that application sent exactly 1 HTTP POST request containing expected billing amount and customer UUID.**:
   - Verify that application sent exactly 1 HTTP POST request containing expected billing amount and customer UUID.

## Recommended Tools & Environments
- MockServer
- Expectation Verification
- Service Mocking
- Integration Testing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
