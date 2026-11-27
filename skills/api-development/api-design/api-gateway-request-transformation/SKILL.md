---
name: api-gateway-request-transformation
description: Configures API gateway header rewrites, path transformations, and query sanitization rules. Use when decoupling public client interfaces from internal microservice endpoints.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.konghq.com/hub/kong-inc/request-transformer/"
---
# Api Gateway Request Transformation

## Overview
API gateways shield internal microservices by stripping sensitive client headers, injecting internal tenant metadata, and rewriting legacy URL paths to clean modern routes.

## Operational Workflow

1. **Define incoming public route patterns and target upstream service destinations.**:
   - Define incoming public route patterns and target upstream service destinations.

2. **Configure header transformations**:
   - Configure header transformations: strip client-spoofed headers and inject verified user claims.

3. **Apply URL path rewrites and regex parameter substitutions.**:
   - Apply URL path rewrites and regex parameter substitutions.

4. **Validate request content length and reject payloads exceeding maximum byte limits.**:
   - Validate request content length and reject payloads exceeding maximum byte limits.

## Recommended Tools & Environments
- API Gateways (Kong, Envoy, Traefik)
- Lua / YAML
- HTTP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
