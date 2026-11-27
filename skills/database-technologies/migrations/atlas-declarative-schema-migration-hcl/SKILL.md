---
name: atlas-declarative-schema-migration-hcl
description: Manages declarative database schemas and generates deterministic migration plans using Ariga Atlas and HCL. Use when applying modern declarative GitOps workflows to database DDL.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://atlasgo.io/"
---
# Atlas Declarative Schema Migration Hcl

## Overview
Atlas brings Terraform-like declarative principles to database management. Developers define desired schema states in HCL or SQL, and Atlas calculates the safest migration execution plan.

## Operational Workflow

1. **Define target database schema state in schema.hcl or declarative SQL file.**:
   - Define target database schema state in schema.hcl or declarative SQL file.

2. **Run atlas schema diff to calculate required DDL statements between current DB and desired schema.**:
   - Run atlas schema diff to calculate required DDL statements between current DB and desired schema.

3. **Analyze migration safety using atlas migrate lint to detect destructive operations (e.g., dropping columns).**:
   - Analyze migration safety using atlas migrate lint to detect destructive operations (e.g., dropping columns).

4. **Apply migration plan via atlas schema apply with interactive confirmation or automated CI runner.**:
   - Apply migration plan via atlas schema apply with interactive confirmation or automated CI runner.

## Recommended Tools & Environments
- Atlas (Ariga)
- HCL / Go
- Declarative DDL
- Schema Diffing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
