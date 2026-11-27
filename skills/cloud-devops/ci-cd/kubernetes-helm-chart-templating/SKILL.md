---
name: kubernetes-helm-chart-templating
description: Authors production-grade Kubernetes Helm charts with configurable values, resource limits, and health probes. Use when packaging cloud-native microservices for Kubernetes deployment.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://helm.sh/docs/chart_template_guide/"
---
# Kubernetes Helm Chart Templating

## Overview
Helm packages Kubernetes manifests into parameterized templates. Production charts require liveness/readiness probes, pod disruption budgets, resource requests/limits, and horizontal autoscaling.

## Operational Workflow

1. **Structure standard Chart.yaml, values.yaml, and templates directory layout.**:
   - Structure standard Chart.yaml, values.yaml, and templates directory layout.

2. **Parameterize Deployment, Service, Ingress, and ConfigMap resources with Go templating.**:
   - Parameterize Deployment, Service, Ingress, and ConfigMap resources with Go templating.

3. **Configure strict liveness, readiness, and startup probes to manage rollout health.**:
   - Configure strict liveness, readiness, and startup probes to manage rollout health.

4. **Lint and validate rendered manifests against Kubernetes API schemas using helm lint and kubeval.**:
   - Lint and validate rendered manifests against Kubernetes API schemas using helm lint and kubeval.

## Recommended Tools & Environments
- Kubernetes
- Helm v3
- YAML
- kubeval

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
