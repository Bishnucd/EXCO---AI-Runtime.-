---
name: cosign-sigstore-image-signing
description: Cryptographically signs and verifies container images using Sigstore Cosign with keyless OIDC identity tokens. Use when guaranteeing container supply chain provenance and integrity.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.sigstore.dev/cosign/overview/"
---
# Cosign Sigstore Image Signing

## Overview
Untrusted container images risk tampering between CI build and Kubernetes deployment. Cosign signs images using GitHub Actions OIDC tokens, recording signatures in the public Rekor transparency ledger.

## Operational Workflow

1. **Build and push container image to container registry.**:
   - Build and push container image to container registry.

2. **Execute cosign sign --yes <image_digest> inside GitHub Actions using workflow OIDC token.**:
   - Execute cosign sign --yes <image_digest> inside GitHub Actions using workflow OIDC token.

3. **Store cryptographic signature and attestation directly in container registry.**:
   - Store cryptographic signature and attestation directly in container registry.

4. **Enforce Kubernetes admission controller (Kyverno / Sigstore policy-controller) to reject unsigned images.**:
   - Enforce Kubernetes admission controller (Kyverno / Sigstore policy-controller) to reject unsigned images.

## Recommended Tools & Environments
- Sigstore Cosign
- OIDC Keyless Signing
- Rekor Transparency Log
- Docker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
