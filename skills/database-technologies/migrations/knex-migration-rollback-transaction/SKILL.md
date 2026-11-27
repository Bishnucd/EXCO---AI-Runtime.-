---
name: knex-migration-rollback-transaction
description: Authors reversible, transactional schema migrations and seeds using Knex.js. Use when managing SQL migrations in Node.js and TypeScript backends.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://knexjs.org/guide/migrations.html"
---
# Knex Migration Rollback Transaction

## Overview
Knex.js provides a schema builder and migration CLI that executes migrations inside isolated database transactions, ensuring atomic application and clean rollbacks on failure.

## Operational Workflow

1. **Generate timestamped migration file with knex migrate**:
   - Generate timestamped migration file with knex migrate:make migration_name.

2. **Implement exports.up schema transformations (knex.schema.createTable, alterTable).**:
   - Implement exports.up schema transformations (knex.schema.createTable, alterTable).

3. **Implement symmetrical exports.down operations to guarantee complete rollback capability.**:
   - Implement symmetrical exports.down operations to guarantee complete rollback capability.

4. **Run knex migrate**:
   - Run knex migrate:latest and knex migrate:rollback to test bidirectional migration health.

## Recommended Tools & Environments
- Knex.js
- Node.js / TypeScript
- SQL Migrations
- Transactions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
