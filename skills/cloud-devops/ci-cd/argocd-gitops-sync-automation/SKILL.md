---
name: argocd-gitops-sync-automation
description: Manages Kubernetes cluster application state declaratively using ArgoCD GitOps synchronizations. Use when automating zero-drift continuous deployment to Kubernetes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://argo-cd.readthedocs.io/en/stable/"
---
# Argocd Gitops Sync Automation

## Overview
GitOps treats Git repositories as the single source of truth for infrastructure. ArgoCD continuously monitors Kubernetes clusters and reconciles live states with git-declared manifests.

## Operational Workflow

1. **Author ArgoCD Application CRD specifying source git repo, target path, and cluster destination.**:
   - Author ArgoCD Application CRD specifying source git repo, target path, and cluster destination.

2. **Configure automated sync policies with selfHeal**:
   - Configure automated sync policies with selfHeal: true and prune: true.

3. **Implement sync waves and resource hooks to coordinate database migration order.**:
   - Implement sync waves and resource hooks to coordinate database migration order.

4. **Monitor application health and auto-rollback when deployment probes fail.**:
   - Monitor application health and auto-rollback when deployment probes fail.

## Recommended Tools & Environments
- ArgoCD
- Kubernetes
- GitOps
- Kustomize

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
