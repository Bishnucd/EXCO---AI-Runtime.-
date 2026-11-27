---
name: graphql-schema-stitching-federation
description: Designs federated GraphQL schemas using Apollo Federation v2 directives for distributed subgraphs. Use when architecting scalable GraphQL APIs across multiple backend microservices.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.apollographql.com/docs/federation/"
---
# Graphql Schema Stitching Federation

## Overview
Apollo Federation allows multiple engineering teams to compose disparate subgraph services into a unified, high-performance GraphQL schema using @key, @shareable, and @external directives.

## Operational Workflow

1. **Identify entity boundaries and declare composite primary keys using the @key directive.**:
   - Identify entity boundaries and declare composite primary keys using the @key directive.

2. **Define subgraph schema files with explicit type extensions and field resolvers.**:
   - Define subgraph schema files with explicit type extensions and field resolvers.

3. **Execute schema composition checks using the Rover CLI to detect federated conflict violations.**:
   - Execute schema composition checks using the Rover CLI to detect federated conflict violations.

4. **Configure query gateway routing and query planning optimizations for cross-service batching.**:
   - Configure query gateway routing and query planning optimizations for cross-service batching.

## Recommended Tools & Environments
- GraphQL
- Apollo Federation v2
- TypeScript
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
