---
name: kaniko-rootless-container-build
description: Builds and pushes Docker container images inside Kubernetes clusters without requiring root daemon privileges using Kaniko. Use when building secure container images in CI/CD.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/GoogleContainerTools/kaniko"
---
# Kaniko Rootless Container Build

## Overview
Mounting /var/run/docker.sock inside CI containers creates severe root container breakout vulnerabilities. Kaniko executes Dockerfile instructions in userspace within standard Kubernetes pods.

## Operational Workflow

1. **Configure Kaniko executor pod manifest with target Dockerfile and build context volume.**:
   - Configure Kaniko executor pod manifest with target Dockerfile and build context volume.

2. **Attach container registry secret credentials via Kubernetes Secret volume mounts.**:
   - Attach container registry secret credentials via Kubernetes Secret volume mounts.

3. **Execute /kaniko/executor with caching enabled to reuse base layer snapshots.**:
   - Execute /kaniko/executor with caching enabled to reuse base layer snapshots.

4. **Push signed container image artifacts directly to cloud registries (ECR, GCR, DockerHub).**:
   - Push signed container image artifacts directly to cloud registries (ECR, GCR, DockerHub).

## Recommended Tools & Environments
- Google Kaniko
- Kubernetes
- Dockerfiles
- Container Registries

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
