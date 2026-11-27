---
name: unpinned-dependency-drift-detector
description: Scans package manifests for unpinned caret (^) and tilde (~) dependencies and unpinned GitHub Actions. Use when enforcing strict deterministic reproducibility in build pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions"
---
# Unpinned Dependency Drift Detector

## Overview
Floating version tags (^1.2.0 or actions/checkout@v3) silently pull in upstream changes during builds, risking supply chain attacks. Pinning packages to exact versions and commit SHAs guarantees stability.

## Operational Workflow

1. **Scan package.json and requirements.txt for loose version specifiers (^, ~, >=, latest).**:
   - Scan package.json and requirements.txt for loose version specifiers (^, ~, >=, latest).

2. **Scan GitHub Actions workflow YAML files for actions pinned to floating branch tags.**:
   - Scan GitHub Actions workflow YAML files for actions pinned to floating branch tags.

3. **Resolve exact immutable commit SHAs for third-party actions using git ls-remote.**:
   - Resolve exact immutable commit SHAs for third-party actions using git ls-remote.

4. **Enforce automated linter rules rejecting PRs that introduce floating or unpinned dependencies.**:
   - Enforce automated linter rules rejecting PRs that introduce floating or unpinned dependencies.

## Recommended Tools & Environments
- Dependency Pinning
- Regex Linters
- GitHub Actions
- YAML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
