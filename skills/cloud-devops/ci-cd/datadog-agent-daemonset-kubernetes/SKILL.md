---
name: datadog-agent-daemonset-kubernetes
description: Deploys and configures the Datadog Agent as a Kubernetes DaemonSet with auto-discovery and log collection. Use when collecting cluster metrics, traces, and container logs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.datadoghq.com/containers/kubernetes/installation/"
---
# Datadog Agent Daemonset Kubernetes

## Overview
Monitoring containerized Kubernetes workloads requires running a node agent DaemonSet that automatically discovers new pods, extracts stdout/stderr logs, and captures host hardware metrics.

## Operational Workflow

1. **Deploy Datadog Operator or Helm chart with cluster agent and node agent DaemonSets.**:
   - Deploy Datadog Operator or Helm chart with cluster agent and node agent DaemonSets.

2. **Store Datadog API and application keys in Kubernetes Secrets.**:
   - Store Datadog API and application keys in Kubernetes Secrets.

3. **Enable log collection, APM trace ingestion, and process monitoring features.**:
   - Enable log collection, APM trace ingestion, and process monitoring features.

4. **Annotate application pods with datadoghq.com/logs annotations for automatic log parsing.**:
   - Annotate application pods with datadoghq.com/logs annotations for automatic log parsing.

## Recommended Tools & Environments
- Datadog Agent
- Kubernetes DaemonSet
- Helm
- APM Tracing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
