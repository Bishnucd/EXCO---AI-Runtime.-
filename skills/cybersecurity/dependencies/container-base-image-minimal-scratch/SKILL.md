---
name: container-base-image-minimal-scratch
description: Builds ultra-minimal container images from scratch or distroless base layers for compiled Go and Rust binaries. Use when eliminating 100% of OS package vulnerabilities in containers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/GoogleContainerTools/distroless"
---
# Container Base Image Minimal Scratch

## Overview
Standard base images (Ubuntu, Debian) bundle hundreds of unnecessary utilities (bash, curl, apt) that accumulate CVEs. Compiling static binaries and placing them inside "scratch" yields zero CVEs.

## Operational Workflow

1. **Compile static binary disabling CGO (CGO_ENABLED=0 go build -ldflags="-s -w").**:
   - Compile static binary disabling CGO (CGO_ENABLED=0 go build -ldflags="-s -w").

2. **Initialize production Dockerfile stage**:
   - Initialize production Dockerfile stage: FROM scratch or FROM gcr.io/distroless/static.

3. **Copy CA certificates from build stage to enable outbound HTTPS API requests.**:
   - Copy CA certificates from build stage to enable outbound HTTPS API requests.

4. **Copy static compiled binary and run under non-root unprivileged user ID (USER 65532**:
   - Copy static compiled binary and run under non-root unprivileged user ID (USER 65532:65532).

## Recommended Tools & Environments
- Docker scratch / distroless
- Go / Rust
- Static Linking
- Container Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
