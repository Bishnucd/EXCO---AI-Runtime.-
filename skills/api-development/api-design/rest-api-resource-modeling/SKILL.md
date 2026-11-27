---
name: rest-api-resource-modeling
description: Models RESTful resources, URL hierarchies, HTTP methods, and status codes following Richardson Maturity Level 2/3. Use when designing clean, predictable REST APIs for web services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://restfulapi.net/resource-naming/"
---
# Rest Api Resource Modeling

## Overview
Predictable REST APIs rely on noun-based hierarchical resources, proper HTTP verbs (GET, POST, PUT, PATCH, DELETE), idempotent mutations, and consistent error envelopes.

## Operational Workflow

1. **Map domain entities into plural noun collections and nested sub-resource paths.**:
   - Map domain entities into plural noun collections and nested sub-resource paths.

2. **Assign idempotent HTTP methods (PUT, DELETE, GET) and non-idempotent methods (POST) correctly.**:
   - Assign idempotent HTTP methods (PUT, DELETE, GET) and non-idempotent methods (POST) correctly.

3. **Structure standard JSON response envelopes containing data, pagination links, and error metadata.**:
   - Structure standard JSON response envelopes containing data, pagination links, and error metadata.

4. **Define RFC 7807 problem details payloads for predictable client error handling.**:
   - Define RFC 7807 problem details payloads for predictable client error handling.

## Recommended Tools & Environments
- REST
- HTTP/1.1 & HTTP/2
- JSON API Spec
- OpenAPI 3.1

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
