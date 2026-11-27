---
name: supabase-db-branching-migration-pipeline
description: Manages preview database branching, declarative schema diffing, and migrations using Supabase CLI. Use when running ephemeral preview environments and GitOps migrations with Supabase.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://supabase.com/docs/guides/cli/managing-environments"
---
# Supabase Db Branching Migration Pipeline

## Overview
Supabase CLI allows developers to spin up local Docker PostgreSQL environments, capture schema changes as timestamped SQL migrations, and push them to production instances.

## Operational Workflow

1. **Start local Supabase stack using supabase start.**:
   - Start local Supabase stack using supabase start.

2. **Make schema modifications in local studio or via raw SQL.**:
   - Make schema modifications in local studio or via raw SQL.

3. **Generate new migration file automatically with supabase db diff -f migration_name.**:
   - Generate new migration file automatically with supabase db diff -f migration_name.

4. **Push tested migrations to remote hosted Supabase project with supabase db push.**:
   - Push tested migrations to remote hosted Supabase project with supabase db push.

## Recommended Tools & Environments
- Supabase CLI
- PostgreSQL
- Preview Branching
- GitOps

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
