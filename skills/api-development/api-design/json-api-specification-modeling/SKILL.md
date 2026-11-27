---
name: json-api-specification-modeling
description: Designs complex relational API payloads following the JSON:API 1.1 standard specification. Use when designing compound documents, sparse fieldsets, and relationship links.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://jsonapi.org/format/"
---
# Json Api Specification Modeling

## Overview
Ad-hoc JSON structures lead to chatty clients and inconsistent relationship modeling. The JSON:API specification standardizes resource objects, compound document inclusion, and pagination links.

## Operational Workflow

1. **Structure resource objects with explicit type, id, attributes, and relationships blocks.**:
   - Structure resource objects with explicit type, id, attributes, and relationships blocks.

2. **Implement compound documents utilizing the include query parameter to prevent N+1 client roundtrips.**:
   - Implement compound documents utilizing the include query parameter to prevent N+1 client roundtrips.

3. **Support sparse fieldsets (fields[type]) to allow mobile clients to request only needed properties.**:
   - Support sparse fieldsets (fields[type]) to allow mobile clients to request only needed properties.

4. **Structure links objects with canonical self, related, first, prev, next, and last URLs.**:
   - Structure links objects with canonical self, related, first, prev, next, and last URLs.

## Recommended Tools & Environments
- JSON:API v1.1
- JSON
- REST
- HTTP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
