---
name: sqitch-target-environment-vcs-migrations
description: Manages VCS-native, dependency-ordered database migrations across disparate SQL engines using Sqitch. Use when managing complex migration dependency graphs without sequential numbering.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://sqitch.org/"
---
# Sqitch Target Environment Vcs Migrations

## Overview
Sqitch frees database change management from sequential numbering by using dependency graphs, letting developers deploy, revert, and verify changes independently across branches.

## Operational Workflow

1. **Initialize project with sqitch init and configure target engine (pg, mysql, sqlite, snowflake).**:
   - Initialize project with sqitch init and configure target engine (pg, mysql, sqlite, snowflake).

2. **Add migration change with sqitch add table_name --requires dependency_name.**:
   - Add migration change with sqitch add table_name --requires dependency_name.

3. **Author deploy, revert, and verify SQL scripts for the change.**:
   - Author deploy, revert, and verify SQL scripts for the change.

4. **Deploy changes using sqitch deploy to target connection URI.**:
   - Deploy changes using sqitch deploy to target connection URI.

## Recommended Tools & Environments
- Sqitch
- Perl / CLI
- Graph Dependencies
- Multi-Database

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
