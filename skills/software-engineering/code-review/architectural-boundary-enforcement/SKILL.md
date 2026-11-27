---
name: architectural-boundary-enforcement
description: Enforces modular architectural layer boundaries and prevents illegal dependency imports in codebases. Use when maintaining clean architecture, hexagonal boundaries, or monorepo module isolation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://eslint.org/docs/latest/rules/no-restricted-imports"
---
# Architectural Boundary Enforcement

## Overview
Codebases degrade as developers accidentally import database entities into UI components or bypass domain layers. Automated architectural linters reject prohibited cross-module import paths.

## Operational Workflow

1. **Define formal architectural layers (Presentation, Application, Domain, Infrastructure).**:
   - Define formal architectural layers (Presentation, Application, Domain, Infrastructure).

2. **Configure dependency-cruiser or ESLint rules prohibiting inward or circular imports.**:
   - Configure dependency-cruiser or ESLint rules prohibiting inward or circular imports.

3. **Run dependency graph validation in CI builds to detect architectural boundary violations.**:
   - Run dependency graph validation in CI builds to detect architectural boundary violations.

4. **Generate visual dependency graph diagrams highlighting forbidden import linkages.**:
   - Generate visual dependency graph diagrams highlighting forbidden import linkages.

## Recommended Tools & Environments
- ESLint
- Dependency-Cruiser
- ArchUnit
- TypeScript / Java

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
