---
name: liquibase-xml-sql-changelog-pipeline
description: Manages enterprise database schema changes across multiple environments using Liquibase change sets. Use when tracking and rolling back database migrations with audit logs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.liquibase.com/"
---
# Liquibase Xml Sql Changelog Pipeline

## Overview
Liquibase tracks, versions, and deploys database schema modifications across disparate RDBMS engines, maintaining strict execution checksums in DATABASECHANGELOG tracking tables.

## Operational Workflow

1. **Author declarative changeSet in XML, YAML, or formatted SQL with rollback instructions.**:
   - Author declarative changeSet in XML, YAML, or formatted SQL with rollback instructions.

2. **Execute liquibase status to inspect unapplied changeSets and validate syntax.**:
   - Execute liquibase status to inspect unapplied changeSets and validate syntax.

3. **Run liquibase update within CI/CD deployment pipeline against target staging/production database.**:
   - Run liquibase update within CI/CD deployment pipeline against target staging/production database.

4. **Verify schema state and checksum recordings in DATABASECHANGELOG table.**:
   - Verify schema state and checksum recordings in DATABASECHANGELOG table.

## Recommended Tools & Environments
- Liquibase
- SQL / XML / YAML
- CI/CD Pipeline
- Database Migration

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
