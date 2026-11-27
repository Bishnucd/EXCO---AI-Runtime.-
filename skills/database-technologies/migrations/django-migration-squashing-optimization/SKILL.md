---
name: django-migration-squashing-optimization
description: Squashes bloated Django migration histories into clean baseline migration files using squashmigrations. Use when speeding up test suite execution and simplifying migration trees.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.djangoproject.com/en/stable/topics/migrations/#squashing-migrations"
---
# Django Migration Squashing Optimization

## Overview
Years of agile development create hundreds of Django migration files that slow down test suite setups. Squashing compiles old migration chains into a single optimized baseline file.

## Operational Workflow

1. **Identify long historical migration chains in Django app directory.**:
   - Identify long historical migration chains in Django app directory.

2. **Run python manage.py squashmigrations app_name target_migration_number.**:
   - Run python manage.py squashmigrations app_name target_migration_number.

3. **Review generated squashed migration file and resolve any circular dependency warnings.**:
   - Review generated squashed migration file and resolve any circular dependency warnings.

4. **Commit squashed migration and delete historical files once all production nodes are upgraded.**:
   - Commit squashed migration and delete historical files once all production nodes are upgraded.

## Recommended Tools & Environments
- Django ORM
- Python
- Migration Squashing
- Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
