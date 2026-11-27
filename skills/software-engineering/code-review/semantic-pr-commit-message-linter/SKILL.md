---
name: semantic-pr-commit-message-linter
description: Enforces Conventional Commits specification and semantic versioning rules in pull requests using commitlint. Use when automating changelog generation and release notes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://commitlint.js.org/"
---
# Semantic Pr Commit Message Linter

## Overview
Inconsistent commit messages break automated release tooling. commitlint validates that commit messages follow the type(scope): description format for automatic changelog compilation.

## Operational Workflow

1. **Configure .commitlintrc.json extending @commitlint/config-conventional.**:
   - Configure .commitlintrc.json extending @commitlint/config-conventional.

2. **Register commit-msg hook using Husky to lint local commit messages before git commit succeeds.**:
   - Register commit-msg hook using Husky to lint local commit messages before git commit succeeds.

3. **Run commitlint action in CI to validate pull request title and squash commit descriptions.**:
   - Run commitlint action in CI to validate pull request title and squash commit descriptions.

4. **Feed validated semantic commits into semantic-release to automatically bump version numbers.**:
   - Feed validated semantic commits into semantic-release to automatically bump version numbers.

## Recommended Tools & Environments
- commitlint
- Conventional Commits
- Semantic Versioning
- Git Hooks

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
