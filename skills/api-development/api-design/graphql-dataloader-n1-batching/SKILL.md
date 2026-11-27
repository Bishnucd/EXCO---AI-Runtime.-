---
name: graphql-dataloader-n1-batching
description: Eliminates GraphQL N+1 database query waterfalls using DataLoader batching and per-request caching. Use when optimizing nested GraphQL resolver performance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/graphql/dataloader"
---
# Graphql Dataloader N1 Batching

## Overview
Nested GraphQL queries naively execute separate database queries for every child entity, causing hundreds of SQL calls. DataLoader coalesces individual loads into single SQL WHERE IN queries.

## Operational Workflow

1. **Instantiate DataLoader per incoming HTTP request to prevent cross-request cache leakage.**:
   - Instantiate DataLoader per incoming HTTP request to prevent cross-request cache leakage.

2. **Define batch loading function accepting array of keys and returning matching ordered records.**:
   - Define batch loading function accepting array of keys and returning matching ordered records.

3. **Invoke loader.load(id) inside nested GraphQL field resolvers.**:
   - Invoke loader.load(id) inside nested GraphQL field resolvers.

4. **Verify database query logs to confirm N separate SELECT statements collapse into one batch query.**:
   - Verify database query logs to confirm N separate SELECT statements collapse into one batch query.

## Recommended Tools & Environments
- GraphQL
- DataLoader
- Node.js
- PostgreSQL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
