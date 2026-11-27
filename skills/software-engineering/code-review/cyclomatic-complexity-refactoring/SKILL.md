---
name: cyclomatic-complexity-refactoring
description: Measures cyclomatic complexity and refactors deeply nested conditionals into clean polymorphism or strategy patterns. Use when simplifying complex, unmaintainable legacy code during code review.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.sonarsource.com/resources/cognitive-complexity/"
---
# Cyclomatic Complexity Refactoring

## Overview
Functions with high cyclomatic complexity (> 10) are bug-prone and difficult to test. Refactoring deeply nested if/else trees into early returns, lookup tables, or Strategy patterns improves clarity.

## Operational Workflow

1. **Compute cyclomatic and cognitive complexity metrics across codebase using static analysis tools.**:
   - Compute cyclomatic and cognitive complexity metrics across codebase using static analysis tools.

2. **Identify functions exceeding threshold limits (complexity score > 10).**:
   - Identify functions exceeding threshold limits (complexity score > 10).

3. **Apply guard clauses and early returns to eliminate nested indentation pyramids.**:
   - Apply guard clauses and early returns to eliminate nested indentation pyramids.

4. **Replace complex branching switch statements with polymorphic strategy classes or dictionary maps.**:
   - Replace complex branching switch statements with polymorphic strategy classes or dictionary maps.

## Recommended Tools & Environments
- SonarQube
- ESLint / Radon
- Clean Code
- Refactoring Patterns

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
