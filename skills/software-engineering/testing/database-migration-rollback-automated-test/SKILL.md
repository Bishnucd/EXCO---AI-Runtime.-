---
name: database-migration-rollback-automated-test
description: Automates CI integration tests that migrate databases up, seed test data, and roll back down cleanly. Use when guaranteeing that database migrations are safely reversible in production.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Schema_migration"
---
# Database Migration Rollback Automated Test

## Overview
Many database migrations cannot be safely rolled back because the down() migration was never tested. Automated rollback tests run up, test insertion, run down, and verify clean initial state.

## Operational Workflow

1. **Spin up fresh ephemeral database instance in CI via Testcontainers or Docker.**:
   - Spin up fresh ephemeral database instance in CI via Testcontainers or Docker.

2. **Execute all database migrations up to target version**:
   - Execute all database migrations up to target version: db:migrate:up.

3. **Insert test seed data into modified tables to verify column and constraint functionality.**:
   - Insert test seed data into modified tables to verify column and constraint functionality.

4. **Execute rollback step**:
   - Execute rollback step: db:migrate:down and verify schema matches baseline schema definition exactly.

## Recommended Tools & Environments
- Migration Testing
- Rollback Verification
- CI Automation
- Database Reliability

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
