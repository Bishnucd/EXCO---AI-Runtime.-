---
name: mikro-orm-schema-generator-diff
description: Calculates schema diffs and generates clean SQL migration files using MikroORM SchemaGenerator. Use when maintaining DDD entities and database schemas in TypeScript.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://mikro-orm.io/docs/migrations"
---
# Mikro Orm Schema Generator Diff

## Overview
MikroORM features an advanced SchemaGenerator that inspects TypeScript entity definitions and database metadata to produce clean, safe SQL migration scripts.

## Operational Workflow

1. **Define domain entities using MikroORM TypeScript decorators (@Entity, @Property).**:
   - Define domain entities using MikroORM TypeScript decorators (@Entity, @Property).

2. **Run npx mikro-orm migration**:
   - Run npx mikro-orm migration:create to generate diff migration file.

3. **Review generated SQL statements ensuring index and foreign key constraints are optimal.**:
   - Review generated SQL statements ensuring index and foreign key constraints are optimal.

4. **Execute npx mikro-orm migration**:
   - Execute npx mikro-orm migration:up in production deployment pipelines.

## Recommended Tools & Environments
- MikroORM
- TypeScript
- Domain-Driven Design (DDD)
- SQL Migrations

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
