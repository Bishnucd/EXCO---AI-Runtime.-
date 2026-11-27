---
name: grafana-dashboard-panel-json-schema
description: Authors declarative Grafana dashboard panel JSON models with PromQL queries and alert thresholds. Use when provisioning reproducible monitoring dashboards via GitOps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/view-dashboard-json-model/"
---
# Grafana Dashboard Panel Json Schema

## Overview
Grafana dashboards can be declared as version-controlled JSON schemas, specifying time series graph panels, Prometheus queries, gauge thresholds, and variable templating.

## Operational Workflow

1. **Define dashboard JSON wrapper with title, tags, refresh rate, and variable dropdown templates.**:
   - Define dashboard JSON wrapper with title, tags, refresh rate, and variable dropdown templates.

2. **Configure panel object with gridPos coordinates, targets array, and PromQL metric query.**:
   - Configure panel object with gridPos coordinates, targets array, and PromQL metric query.

3. **Set thresholds steps for automated color transitions (green/yellow/red) on critical limits.**:
   - Set thresholds steps for automated color transitions (green/yellow/red) on critical limits.

4. **Deploy dashboard definition automatically via Grafana REST API or Terraform provider.**:
   - Deploy dashboard definition automatically via Grafana REST API or Terraform provider.

## Recommended Tools & Environments
- Grafana
- PromQL / Flux
- JSON Model
- Infrastructure as Code

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
