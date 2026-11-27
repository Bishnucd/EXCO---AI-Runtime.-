---
name: github-actions-caching-dependency-optimizer
description: Implements smart dependency and build caching in GitHub Actions using actions/cache with lockfile hash keys. Use when slashing CI workflow duration by avoiding re-downloading packages.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/actions/cache"
---
# Github Actions Caching Dependency Optimizer

## Overview
Re-installing npm modules, pip wheels, or Cargo crates on every CI run wastes minutes of developer time. Hash-key based caching restores dependencies instantly when lockfiles have not changed.

## Operational Workflow

1. **Configure actions/cache step with path pointing to package store (~/.npm, ~/.cargo).**:
   - Configure actions/cache step with path pointing to package store (~/.npm, ~/.cargo).

2. **Compute cache key using runner.os and hashFiles("**/package-lock.json").**:
   - Compute cache key using runner.os and hashFiles("**/package-lock.json").

3. **Provide fallback restore-keys prefixes to enable partial cache hits during minor updates.**:
   - Provide fallback restore-keys prefixes to enable partial cache hits during minor updates.

4. **Skip package download and compilation steps when cache-hit === "true".**:
   - Skip package download and compilation steps when cache-hit === "true".

## Recommended Tools & Environments
- GitHub Actions
- actions/cache
- Node.js / Python / Rust
- CI/CD

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
