---
name: naming-convention-clean-code-consistency
description: Enforces ubiquitous language, domain naming conventions, and cognitive readability in code reviews. Use when improving long-term maintainability and readability of enterprise codebases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://martinfowler.com/bliki/UbiquitousLanguage.html"
---
# Naming Convention Clean Code Consistency

## Overview
Poor naming creates cognitive friction and hides business bugs. Systematic naming audits ensure variable, function, and class names reflect ubiquitous domain language rather than implementation details.

## Operational Workflow

1. **Verify that variable and method names reveal intent without requiring implementation inspection.**:
   - Verify that variable and method names reveal intent without requiring implementation inspection.

2. **Ensure domain concepts use consistent ubiquitous terms (e.g., don't mix "Client", "Customer", and "User").**:
   - Ensure domain concepts use consistent ubiquitous terms (e.g., don't mix "Client", "Customer", and "User").

3. **Check that boolean variables are prefixed with assertive predicates (isEnabled, hasPermission, shouldRetry).**:
   - Check that boolean variables are prefixed with assertive predicates (isEnabled, hasPermission, shouldRetry).

4. **Eliminate vague filler words (Data, Info, Manager, Handler) in favor of precise domain entities.**:
   - Eliminate vague filler words (Data, Info, Manager, Handler) in favor of precise domain entities.

## Recommended Tools & Environments
- Clean Code
- Ubiquitous Language
- Domain-Driven Design (DDD)
- Code Review

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
