---
name: renovate-automated-dependency-pr-bot
description: Configures Renovate Bot for automated, grouped dependency updates with automerge and vulnerability patching. Use when keeping dependencies current and eliminating stale package rot.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.renovatebot.com/"
---
# Renovate Automated Dependency Pr Bot

## Overview
Unmaintained dependencies accumulate security CVEs over time. Renovate creates pull requests for new package releases, running CI tests and auto-merging safe patch updates automatically.

## Operational Workflow

1. **Create renovate.json extending config**:
   - Create renovate.json extending config:base with packageRules configurations.

2. **Group related packages together (e.g. all monorepo packages, all ESLint plugins) into single PRs.**:
   - Group related packages together (e.g. all monorepo packages, all ESLint plugins) into single PRs.

3. **Configure lockFileMaintenance to refresh lockfiles weekly without major bumps.**:
   - Configure lockFileMaintenance to refresh lockfiles weekly without major bumps.

4. **Enable automerge**:
   - Enable automerge: true for passing minor/patch updates to reduce developer review fatigue.

## Recommended Tools & Environments
- Renovate Bot
- JSON / JSON5
- GitHub / GitLab
- Semantic Versioning

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
