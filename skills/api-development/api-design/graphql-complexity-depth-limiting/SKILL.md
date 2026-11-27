---
name: graphql-complexity-depth-limiting
description: Calculates query complexity scores and restricts AST depth in GraphQL servers to prevent denial-of-service. Use when protecting public GraphQL APIs from malicious recursive queries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/slicknode/graphql-query-complexity"
---
# Graphql Complexity Depth Limiting

## Overview
Malicious clients can submit deeply nested recursive queries (e.g. author -> books -> author -> books) that exhaust server CPU and memory. Static AST analysis blocks abusive queries before execution.

## Operational Workflow

1. **Configure depth limiting validation rule rejecting queries deeper than N levels (e.g. max depth 7).**:
   - Configure depth limiting validation rule rejecting queries deeper than N levels (e.g. max depth 7).

2. **Assign complexity cost points to schema fields (e.g. scalar = 1, list = 10 * pagination limit).**:
   - Assign complexity cost points to schema fields (e.g. scalar = 1, list = 10 * pagination limit).

3. **Calculate total query cost at compile time before invoking any resolvers.**:
   - Calculate total query cost at compile time before invoking any resolvers.

4. **Reject queries exceeding maximum cost threshold with HTTP 400 Bad Request error.**:
   - Reject queries exceeding maximum cost threshold with HTTP 400 Bad Request error.

## Recommended Tools & Environments
- GraphQL
- AST Validation
- Node.js
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
