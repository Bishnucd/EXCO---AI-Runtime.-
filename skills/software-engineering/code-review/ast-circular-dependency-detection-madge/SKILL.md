---
name: ast-circular-dependency-detection-madge
description: Detects circular module dependencies and import cycles in JavaScript/TypeScript codebases using Madge. Use when preventing runtime initialization bugs and bundler chunk bloat.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/pahen/madge"
---
# Ast Circular Dependency Detection Madge

## Overview
Circular imports (Module A imports B, B imports A) cause undefined runtime imports and break bundler tree-shaking. Madge parses Abstract Syntax Trees (AST) to detect and visualize cycles.

## Operational Workflow

1. **Run npx madge --circular --extensions ts,tsx src/ across repository source trees.**:
   - Run npx madge --circular --extensions ts,tsx src/ across repository source trees.

2. **Inspect circular dependency chains reported in terminal output.**:
   - Inspect circular dependency chains reported in terminal output.

3. **Break cycles by extracting shared types/utilities into independent leaf modules or using dependency inversion.**:
   - Break cycles by extracting shared types/utilities into independent leaf modules or using dependency inversion.

4. **Integrate madge --circular as a mandatory passing check in GitHub Actions CI.**:
   - Integrate madge --circular as a mandatory passing check in GitHub Actions CI.

## Recommended Tools & Environments
- Madge
- AST Analysis
- Circular Dependencies
- TypeScript / JavaScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
