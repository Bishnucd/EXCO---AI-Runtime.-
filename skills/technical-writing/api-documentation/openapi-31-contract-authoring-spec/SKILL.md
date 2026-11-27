---
name: openapi-31-contract-authoring-spec
description: Authors comprehensive OpenAPI 3.1 specifications with complete JSON Schema, examples, and security schemes. Use when establishing design-first API contracts for developer portals.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://spec.openapis.org/oas/v3.1.0"
---
# Openapi 31 Contract Authoring Spec

## Overview
OpenAPI 3.1 aligns fully with JSON Schema 2020-12, allowing complete modeling of complex types, webhooks, polymorphic schemas (oneOf, anyOf), and OAuth2/mTLS authentication schemes.

## Operational Workflow

1. **Define openapi**:
   - Define openapi: 3.1.0 header with info object, servers array, and contact metadata.

2. **Declare paths endpoints with operationId, parameters, requestBody, and detailed responses.**:
   - Declare paths endpoints with operationId, parameters, requestBody, and detailed responses.

3. **Model reusable schemas under components/schemas with complete description and example attributes.**:
   - Model reusable schemas under components/schemas with complete description and example attributes.

4. **Define components/securitySchemes declaring Bearer JWT, OAuth2 scopes, or API key parameters.**:
   - Define components/securitySchemes declaring Bearer JWT, OAuth2 scopes, or API key parameters.

## Recommended Tools & Environments
- OpenAPI 3.1
- JSON Schema 2020-12
- API Design
- Documentation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
