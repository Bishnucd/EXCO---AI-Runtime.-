---
name: dagster-software-defined-assets
description: Builds declarative data platforms based on Software-Defined Assets and partition schedules using Dagster. Use when structuring data pipelines around assets rather than monolithic tasks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.dagster.io/concepts/assets/software-defined-assets"
---
# Dagster Software Defined Assets

## Overview
Dagster rethinks data orchestration by treating data assets (tables, ML models, files) as the primary abstraction, tracking lineage, compute dependencies, and freshness policies.

## Operational Workflow

1. **Define data entities using @asset decorator declaring upstream asset dependencies.**:
   - Define data entities using @asset decorator declaring upstream asset dependencies.

2. **Configure hourly/daily partitions using DailyPartitionsDefinition.**:
   - Configure hourly/daily partitions using DailyPartitionsDefinition.

3. **Declare FreshnessPolicy defining maximum acceptable lag before raising alerts.**:
   - Declare FreshnessPolicy defining maximum acceptable lag before raising alerts.

4. **Launch Dagster webserver UI to inspect asset lineage graph and trigger backfill runs.**:
   - Launch Dagster webserver UI to inspect asset lineage graph and trigger backfill runs.

## Recommended Tools & Environments
- Dagster
- Python
- Asset-Oriented Orchestration
- Data Mesh

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
