---
name: dead-code-elimination-knip-ts-prune
description: Identifies unused exports, dead files, and unreferenced dependencies using Knip and ts-prune. Use when pruning bloated codebases and speeding up compilation times.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/webpro-nl/knip"
---
# Dead Code Elimination Knip Ts Prune

## Overview
Dead code clutters repositories, confuses developers, and increases bundle sizes. Knip analyzes project ASTs to identify unused files, unused exports, duplicate types, and uninstalled npm packages.

## Operational Workflow

1. **Install knip and configure knip.json specifying monorepo project entries and plugins.**:
   - Install knip and configure knip.json specifying monorepo project entries and plugins.

2. **Run npx knip to scan entire repository for orphaned files and unused exports.**:
   - Run npx knip to scan entire repository for orphaned files and unused exports.

3. **Verify that flagged exports are not consumed dynamically or via reflection.**:
   - Verify that flagged exports are not consumed dynamically or via reflection.

4. **Safely delete confirmed dead code and unused dependencies, verifying that test suites pass.**:
   - Safely delete confirmed dead code and unused dependencies, verifying that test suites pass.

## Recommended Tools & Environments
- Knip
- ts-prune
- Dead Code Elimination
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
