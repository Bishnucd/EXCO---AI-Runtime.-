---
name: alembic-postgresql-schema-sync
description: Generates and applies versioned Python SQLAlchemy database migrations using Alembic. Use when synchronizing SQLAlchemy ORM models with PostgreSQL database schemas.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://alembic.sqlalchemy.org/en/latest/"
---
# Alembic Postgresql Schema Sync

## Overview
Alembic tracks incremental schema changes as executable Python scripts. It detects differences between SQLAlchemy model declarations and live database catalogs to generate clean upgrade and downgrade steps.

## Operational Workflow

1. **Define SQLAlchemy declarative models and import metadata into alembic/env.py.**:
   - Define SQLAlchemy declarative models and import metadata into alembic/env.py.

2. **Run alembic revision --autogenerate to inspect schema differences and create versioned scripts.**:
   - Run alembic revision --autogenerate to inspect schema differences and create versioned scripts.

3. **Inspect generated upgrade() and downgrade() functions for precision and index constraints.**:
   - Inspect generated upgrade() and downgrade() functions for precision and index constraints.

4. **Execute alembic upgrade head to apply migrations within transactional blocks.**:
   - Execute alembic upgrade head to apply migrations within transactional blocks.

## Recommended Tools & Environments
- Alembic
- SQLAlchemy
- PostgreSQL
- Python 3.10+

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
