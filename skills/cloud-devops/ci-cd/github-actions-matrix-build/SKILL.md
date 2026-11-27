---
name: github-actions-matrix-build
description: Configures GitHub Actions CI/CD workflows utilizing build matrices, caching, artifact uploads, and environment security secrets. Use when setting up automated multi-platform testing, building, and deployment pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.github.com/en/actions"
---

# GitHub Actions Matrix Build

## Overview
Continuous integration requires testing codebases across multiple OS platforms and runtime versions. This skill outlines configuring GitHub Actions workflow files (`.github/workflows/*.yml`) that leverage matrix strategies, dependency caching, concurrency control, and least-privilege security permissions.

## Operational Workflow

1. **Workflow Trigger and Permissions**:
   - Set events: `push` on main/release branches, `pull_request` targeting default branches.
   - Restrict GITHUB_TOKEN permissions at the top level: `permissions: contents: read` (principle of least privilege).
   - Configure concurrency cancellation: `concurrency: group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true`.

2. **Matrix Strategy Configuration**:
   - Define matrix dimensions: `os: [ubuntu-latest, windows-latest, macos-latest]`, `node-version: [18.x, 20.x, 22.x]`.
   - Use `exclude` or `include` to tailor specific architectural edge cases.

3. **Step Execution and Caching**:
   - Use official certified actions: `actions/checkout@v4`, `actions/setup-node@v4` with built-in caching (`cache: 'npm'`).
   - Execute deterministic package installation (`npm ci`, `poetry install --no-root`).
   - Run linter, unit test suites, and coverage collection steps.

4. **Artifact Management and Reporting**:
   - Archive build logs or code coverage reports using `actions/upload-artifact@v4`.
   - Set step timeouts (`timeout-minutes: 15`) to prevent runaway build minutes.
