---
name: openapi-spec-authoring
description: Authors and validates contract-first OpenAPI 3.1 specifications with complete schemas, parameter definitions, and status code responses. Use when designing new REST APIs or establishing API contracts before backend implementation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://spec.openapis.org/oas/v3.1.0"
---

# OpenAPI Spec Authoring

## Overview
Contract-first API development requires establishing unambiguous specifications using the OpenAPI 3.1 standard before writing code. This skill provides instructions for generating machine-readable OpenAPI documents containing path operations, reusable schemas, authentication components, and status codes.

## Operational Workflow

1. **Information and Server Definition**:
   - Define API metadata: title, semantic version, description, and base server URLs (development, staging, production).
   - Configure global security schemes (Bearer JWT, OAuth 2.0 flows, API keys).

2. **Resource & Path Design**:
   - Model RESTful resource hierarchies using plural nouns (`/v1/customers`, `/v1/customers/{customerId}/orders`).
   - Define HTTP methods strictly adhering to idempotency standards (GET, POST, PUT, PATCH, DELETE).
   - Document query, path, header, and cookie parameters with explicit types and required flags.

3. **Schema Definition in `components/schemas`**:
   - Define JSON Schema 2020-12 compliant models for request bodies and response payloads.
   - Enforce field constraints: `minimum`, `maximum`, `pattern`, `format` (e.g. `uuid`, `date-time`, `email`).
   - Define distinct Create, Update, and Read schemas to prevent client payload manipulation.

4. **Response Status Mapping**:
   - Map standard HTTP response codes: 200 (OK), 201 (Created), 204 (No Content).
   - Standardize error responses adhering to RFC 7807 (Problem Details for HTTP APIs) for 400, 401, 403, 404, 409, 422, and 500 errors.

5. **Linting and Validation**:
   - Validate against the OpenAPI 3.1 JSON Schema.
   - Run Spectral rulesets to enforce naming conventions, description completeness, and security requirements.
