---
name: docker-multi-stage-minimal-build
description: Constructs hardened, minimal multi-stage Dockerfiles utilizing distroless or alpine base layers. Use when minimizing container attack surface and optimizing deployment image size.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.docker.com/build/building/multi-stage/"
---
# Docker Multi Stage Minimal Build

## Overview
Multi-stage Docker builds separate build toolchains from runtime containers, creating tiny production images without compilers, package managers, or debugging utilities.

## Operational Workflow

1. **Create build stage installing full SDKs, compilers, and native dependencies.**:
   - Create build stage installing full SDKs, compilers, and native dependencies.

2. **Compile static binaries or bundle minified application assets.**:
   - Compile static binaries or bundle minified application assets.

3. **Initialize production stage from Google Container Tools distroless or minimal alpine base.**:
   - Initialize production stage from Google Container Tools distroless or minimal alpine base.

4. **Copy only the compiled binary and necessary runtime certificates into the final container.**:
   - Copy only the compiled binary and necessary runtime certificates into the final container.

## Recommended Tools & Environments
- Docker
- Distroless
- Alpine Linux
- BuildKit

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
