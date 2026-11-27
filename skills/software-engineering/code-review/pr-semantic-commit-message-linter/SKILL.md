---
name: pr-semantic-commit-message-linter
description: Enforces Conventional Commits specification and PR description completeness in code review workflows. Use when maintaining clean, machine-readable git histories and automated changelogs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.conventionalcommits.org/en/v1.0.0/"
---
# Pr Semantic Commit Message Linter

## Overview
Sloppy git commit messages obscure repository history. Enforcing Conventional Commits (feat:, fix:, chore:, docs:) powers automated semantic versioning and changelog generation.

## Operational Workflow

1. **Configure commitlint.config.js with conventional commit rules and allowed scope types.**:
   - Configure commitlint.config.js with conventional commit rules and allowed scope types.

2. **Install pre-commit and commit-msg git hooks to reject non-conforming commit messages locally.**:
   - Install pre-commit and commit-msg git hooks to reject non-conforming commit messages locally.

3. **Run PR title linting in CI workflows to ensure merge commits adhere to standards.**:
   - Run PR title linting in CI workflows to ensure merge commits adhere to standards.

4. **Generate automated changelogs directly from parsed git commit history tags.**:
   - Generate automated changelogs directly from parsed git commit history tags.

## Recommended Tools & Environments
- commitlint
- Git Hooks
- GitHub Actions
- Regex

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
