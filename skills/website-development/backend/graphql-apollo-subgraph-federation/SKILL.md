---
name: graphql-apollo-subgraph-federation
description: Designs modular Apollo Federation v2 subgraphs with @key and @shareable entity directives. Use when scaling GraphQL backends across multiple autonomous engineering teams.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.apollographql.com/docs/federation/"
---
# Graphql Apollo Subgraph Federation

## Overview
Monolithic GraphQL schemas create deployment bottlenecks. Apollo Federation allows independent services to define subgraphs that compose into a unified supergraph gateway router.

## Operational Workflow

1. **Define subgraph schemas with @key(fields**:
   - Define subgraph schemas with @key(fields: "id") directives on shared entity types (e.g., User, Product).

2. **Declare @shareable on fields that multiple subgraphs can resolve collaboratively.**:
   - Declare @shareable on fields that multiple subgraphs can resolve collaboratively.

3. **Compose subgraphs into supergraph schema using Rover CLI (rover supergraph compose).**:
   - Compose subgraphs into supergraph schema using Rover CLI (rover supergraph compose).

4. **Deploy Apollo Router (Rust) as high-performance federated gateway handling query plan execution.**:
   - Deploy Apollo Router (Rust) as high-performance federated gateway handling query plan execution.

## Recommended Tools & Environments
- Apollo Federation v2
- GraphQL Subgraphs
- Entity Directives
- Microservices

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
