---
name: api-backward-compatibility-breaking-change-check
description: Detects breaking changes in REST/GraphQL/gRPC APIs using oasdiff and buf breaking. Use when protecting public API contracts and mobile clients from unexpected breaks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/Tufin/oasdiff"
---
# Api Backward Compatibility Breaking Change Check

## Overview
Renaming an API field or changing a parameter type breaks mobile apps and external integrations. Automated schema diffing compares current PR specs against the main branch to block breaking changes.

## Operational Workflow

1. **Extract OpenAPI specification, Protobuf definition, or GraphQL schema from current PR branch.**:
   - Extract OpenAPI specification, Protobuf definition, or GraphQL schema from current PR branch.

2. **Fetch canonical base schema from main/master branch.**:
   - Fetch canonical base schema from main/master branch.

3. **Run breaking change detector**:
   - Run breaking change detector: oasdiff breaking base.yaml pr.yaml or buf breaking --against .git#branch=main.

4. **Fail PR verification if removed endpoints, modified status codes, or new required parameters are detected.**:
   - Fail PR verification if removed endpoints, modified status codes, or new required parameters are detected.

## Recommended Tools & Environments
- oasdiff
- buf breaking
- API Compatibility
- Contract Testing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
