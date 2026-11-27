---
name: wiremock-api-stubbing-service-virtualization
description: Stubs external HTTP APIs and injects network fault scenarios using WireMock service virtualization. Use when testing frontends and microservices in isolation from third-party down times.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://wiremock.org/docs/"
---
# Wiremock Api Stubbing Service Virtualization

## Overview
Relying on external sandbox APIs causes test flakiness due to rate limits and downtime. WireMock runs standalone mock servers matching HTTP paths, headers, and payloads with dynamic templating.

## Operational Workflow

1. **Define declarative JSON stub mapping matching target HTTP method, URL pattern, and request body.**:
   - Define declarative JSON stub mapping matching target HTTP method, URL pattern, and request body.

2. **Configure stub response status code, headers, and dynamic Handlebars response body payloads.**:
   - Configure stub response status code, headers, and dynamic Handlebars response body payloads.

3. **Simulate network faults**:
   - Simulate network faults: inject 5000ms response delays, random socket connection drops, or malformed bytes.

4. **Verify that downstream application gracefully handles upstream third-party service outages.**:
   - Verify that downstream application gracefully handles upstream third-party service outages.

## Recommended Tools & Environments
- WireMock
- Service Virtualization
- API Mocking
- Fault Injection

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
