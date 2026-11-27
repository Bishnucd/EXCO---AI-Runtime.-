---
name: prisma-schema-declarative-diff
description: Manages type-safe declarative schema modeling and SQL migrations using Prisma ORM. Use when developing TypeScript full-stack applications with PostgreSQL or MySQL.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.prisma.io/docs/concepts/components/prisma-migrate"
---
# Prisma Schema Declarative Diff

## Overview
Prisma Migrate compiles a declarative schema.prisma model file into deterministic SQL migration steps, generating strongly-typed TypeScript database clients automatically.

## Operational Workflow

1. **Declare data models, relations, and index attributes in schema.prisma.**:
   - Declare data models, relations, and index attributes in schema.prisma.

2. **Run prisma migrate dev --name <migration_name> to generate incremental SQL migration files.**:
   - Run prisma migrate dev --name <migration_name> to generate incremental SQL migration files.

3. **Generate updated TypeScript PrismaClient types matching new schema shapes.**:
   - Generate updated TypeScript PrismaClient types matching new schema shapes.

4. **Deploy migrations safely to staging and production using prisma migrate deploy.**:
   - Deploy migrations safely to staging and production using prisma migrate deploy.

## Recommended Tools & Environments
- Prisma
- TypeScript
- PostgreSQL
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
