---
name: service-catalog-slm-contract-spec
description: Defines internal IT and engineering service catalog entries with explicit SLA, SLO, and SLI contracts. Use when establishing service level management between internal enterprise teams.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://sre.google/sre-book/service-level-objectives/"
---
# Service Catalog Slm Contract Spec

## Overview
Internal teams suffer from conflicting expectations without formal agreements. A service catalog documents service ownership, API interfaces, availability targets (SLOs), and support escalation tiers.

## Operational Workflow

1. **Define service metadata**:
   - Define service metadata: owning team, communication channels, repository, and runbook links.

2. **Specify Service Level Indicators (SLIs) measuring error rates and latency distributions.**:
   - Specify Service Level Indicators (SLIs) measuring error rates and latency distributions.

3. **Establish internal Service Level Objectives (e.g. 99.95% successful requests over 30 days).**:
   - Establish internal Service Level Objectives (e.g. 99.95% successful requests over 30 days).

4. **Define error budget policies**:
   - Define error budget policies: halt new feature deployments when error budgets are depleted.

## Recommended Tools & Environments
- Google SRE Framework
- SLI/SLO/SLA
- Service Catalog
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
