---
name: database-query-n1-detection-bullet
description: Detects N+1 database queries in ORM models and serializers using Bullet and query listeners. Use when eliminating database query explosions in pull requests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/flyerhzm/bullet"
---
# Database Query N1 Detection Bullet

## Overview
N+1 queries occur when an ORM queries a parent record and then executes a separate query for each child item in a loop. Tooling detects un-eager-loaded relationships before code deploys.

## Operational Workflow

1. **Install query profiling detector (e.g., bullet gem for Rails, django-silk for Django, or Hibernate listener).**:
   - Install query profiling detector (e.g., bullet gem for Rails, django-silk for Django, or Hibernate listener).

2. **Run integration test suites with N+1 assertions enabled.**:
   - Run integration test suites with N+1 assertions enabled.

3. **Inspect flagged query execution traces where identical SELECT queries run with varying foreign key IDs.**:
   - Inspect flagged query execution traces where identical SELECT queries run with varying foreign key IDs.

4. **Resolve N+1 bottlenecks by adding eager loading (includes, select_related, or prefetch_related).**:
   - Resolve N+1 bottlenecks by adding eager loading (includes, select_related, or prefetch_related).

## Recommended Tools & Environments
- N+1 Detection
- Bullet
- ORM Optimization
- SQL Profiling

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
