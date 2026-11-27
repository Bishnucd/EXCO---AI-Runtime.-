---
name: hasura-metadata-migration-cli
description: Manages Hasura GraphQL Engine schema tracking, permissions, and relationships using Hasura CLI migrations. Use when versioning GraphQL schema definitions alongside database DDL.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://hasura.io/docs/latest/migrations-metadata-seeds/overview/"
---
# Hasura Metadata Migration Cli

## Overview
Hasura decouples raw database DDL from GraphQL metadata (permissions, relationships, remote schemas). Hasura CLI tracks both in synchronization using GitOps workflows.

## Operational Workflow

1. **Initialize Hasura project folder with hasura init.**:
   - Initialize Hasura project folder with hasura init.

2. **Create database DDL migration using hasura migrate create name.**:
   - Create database DDL migration using hasura migrate create name.

3. **Export GraphQL permission and relationship configurations with hasura metadata export.**:
   - Export GraphQL permission and relationship configurations with hasura metadata export.

4. **Apply unified migrations and metadata in production CI with hasura migrate apply && hasura metadata apply.**:
   - Apply unified migrations and metadata in production CI with hasura migrate apply && hasura metadata apply.

## Recommended Tools & Environments
- Hasura CLI
- GraphQL
- PostgreSQL
- Metadata Migrations

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
