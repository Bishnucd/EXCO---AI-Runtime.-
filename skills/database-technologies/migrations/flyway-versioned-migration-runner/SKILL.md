---
name: flyway-versioned-migration-runner
description: Executes forward-only, checksum-verified SQL migration scripts using Flyway CLI. Use when managing schema evolution across enterprise Java, Go, or microservice environments.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://documentation.red-gate.com/fd"
---
# Flyway Versioned Migration Runner

## Overview
Flyway enforces deterministic, repeatable schema versioning using immutable SQL scripts named V<version>__<description>.sql. Checksum validation prevents tampered or out-of-order migrations.

## Operational Workflow

1. **Structure migrations as V001__init.sql, V002__add_index.sql following semantic versioning.**:
   - Structure migrations as V001__init.sql, V002__add_index.sql following semantic versioning.

2. **Validate script checksums against flyway_schema_history to verify release immutability.**:
   - Validate script checksums against flyway_schema_history to verify release immutability.

3. **Execute flyway migrate in deployment entrypoints before starting application servers.**:
   - Execute flyway migrate in deployment entrypoints before starting application servers.

4. **Use repeatable migrations (R__*.sql) for views, stored procedures, and triggers.**:
   - Use repeatable migrations (R__*.sql) for views, stored procedures, and triggers.

## Recommended Tools & Environments
- Flyway
- SQL
- PostgreSQL / Oracle / MySQL
- Docker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
