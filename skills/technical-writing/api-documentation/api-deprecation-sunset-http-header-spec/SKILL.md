---
name: api-deprecation-sunset-http-header-spec
description: Documents and configures RFC 8594 Sunset and Deprecation HTTP response headers with migration timelines. Use when deprecating legacy endpoints transparently for external developers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc8594"
---
# Api Deprecation Sunset Http Header Spec

## Overview
Silently turning off APIs damages customer trust. RFC 8594 defines standard Sunset: <date> and Deprecation: @<timestamp> HTTP response headers to inform API consumers programmatically.

## Operational Workflow

1. **Document planned API deprecation milestones and final shutdown date in API reference.**:
   - Document planned API deprecation milestones and final shutdown date in API reference.

2. **Configure API Gateway or middleware to emit Deprecation**:
   - Configure API Gateway or middleware to emit Deprecation: true and Sunset: Wed, 11 Nov 2026 00:00:00 GMT.

3. **Include Link header pointing to migration documentation**:
   - Include Link header pointing to migration documentation: Link: <https://api.example.com/migration>; rel="sunset".

4. **Monitor API gateway traffic logs to track remaining client volume on deprecated routes before shutdown.**:
   - Monitor API gateway traffic logs to track remaining client volume on deprecated routes before shutdown.

## Recommended Tools & Environments
- RFC 8594 Sunset Header
- Deprecation Header
- API Lifecycle
- HTTP Standards

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
