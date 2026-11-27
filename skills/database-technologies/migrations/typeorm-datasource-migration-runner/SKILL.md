---
name: typeorm-datasource-migration-runner
description: Generates and runs TypeScript database migrations using TypeORM DataSource CLI. Use when synchronizing TypeScript entity models with SQL relational databases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://typeorm.io/migrations"
---
# Typeorm Datasource Migration Runner

## Overview
TypeORM compares declared TypeScript entity classes against the current database schema to automatically generate reversible SQL migration files.

## Operational Workflow

1. **Configure TypeORM DataSource configuration file with entities and migration glob paths.**:
   - Configure TypeORM DataSource configuration file with entities and migration glob paths.

2. **Generate migration comparing entities against live DB with typeorm migration**:
   - Generate migration comparing entities against live DB with typeorm migration:generate.

3. **Inspect generated TypeScript migration file containing up() and down() SQL queries.**:
   - Inspect generated TypeScript migration file containing up() and down() SQL queries.

4. **Run typeorm migration**:
   - Run typeorm migration:run within container deployment entrypoint scripts.

## Recommended Tools & Environments
- TypeORM
- TypeScript
- Node.js
- Relational Databases

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
