---
name: dependency-confusion-namespace-protection
description: Configures internal private package scope registrations and npmrc/pip config boundaries to prevent dependency confusion. Use when securing enterprise packages from public namespace squatting.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610"
---
# Dependency Confusion Namespace Protection

## Overview
Public package registries allow attackers to publish public packages matching internal private package names. Scope prefixes (@company/) and strict registry routing prevent package hijacking.

## Operational Workflow

1. **Prefix all internal proprietary packages with organization scopes (e.g. @company/auth-core).**:
   - Prefix all internal proprietary packages with organization scopes (e.g. @company/auth-core).

2. **Configure .npmrc specifying that scoped packages resolve strictly to internal artifact repositories.**:
   - Configure .npmrc specifying that scoped packages resolve strictly to internal artifact repositories.

3. **Configure pip.conf with --extra-index-url safety configurations and package pin hashes.**:
   - Configure pip.conf with --extra-index-url safety configurations and package pin hashes.

4. **Claim empty defensive placeholder package names on public npm and PyPI registries.**:
   - Claim empty defensive placeholder package names on public npm and PyPI registries.

## Recommended Tools & Environments
- Scoped Packages
- npmrc / pip.conf
- Artifactory / Nexus
- Supply Chain

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
