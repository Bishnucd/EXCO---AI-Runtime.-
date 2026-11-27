---
name: api-versioning-url-vs-header
description: Implements and transitions API versioning strategies across URL path, query parameter, and accept header variants. Use when managing lifecycle deprecation and breaking changes in APIs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#versioning-a-restful-web-api"
---
# Api Versioning Url Vs Header

## Overview
Evolving APIs without breaking existing mobile and third-party consumers requires deliberate versioning architecture, deprecation headers (Sunset, Deprecation), and migration pathways.

## Operational Workflow

1. **Choose versioning paradigm (URL prefix /v1/ vs Content Negotiation Accept**:
   - Choose versioning paradigm (URL prefix /v1/ vs Content Negotiation Accept: application/vnd.company.v2+json).

2. **Implement routing middleware parsing requested version and dispatching to appropriate handler.**:
   - Implement routing middleware parsing requested version and dispatching to appropriate handler.

3. **Inject standard IETF Deprecation and Sunset headers on deprecated endpoint versions.**:
   - Inject standard IETF Deprecation and Sunset headers on deprecated endpoint versions.

4. **Log telemetry correlating active client user-agents with legacy version usage.**:
   - Log telemetry correlating active client user-agents with legacy version usage.

## Recommended Tools & Environments
- HTTP Headers
- Routing Middleware
- SemVer
- Express / FastAPI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
