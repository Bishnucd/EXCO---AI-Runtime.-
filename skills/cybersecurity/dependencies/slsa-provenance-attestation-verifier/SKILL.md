---
name: slsa-provenance-attestation-verifier
description: Generates and verifies Supply-chain Levels for Software Artifacts (SLSA) Level 3 build provenance attestations. Use when proving build integrity using cryptographic provenance assertions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://slsa.dev/spec/v1.0/provenance"
---
# Slsa Provenance Attestation Verifier

## Overview
SLSA Level 3 guarantees that build artifacts were compiled on non-falsifiable cloud runners from verified git commits. Verifying provenance JSON attestations proves binary pedigree.

## Operational Workflow

1. **Build release binaries using trusted slsa-framework/slsa-github-generator reusable workflows.**:
   - Build release binaries using trusted slsa-framework/slsa-github-generator reusable workflows.

2. **Generate in-toto provenance attestation linking artifact SHA-256 hash to source git commit and workflow.**:
   - Generate in-toto provenance attestation linking artifact SHA-256 hash to source git commit and workflow.

3. **Upload signed attestation file (.intoto.jsonl) alongside GitHub release assets.**:
   - Upload signed attestation file (.intoto.jsonl) alongside GitHub release assets.

4. **Verify attestation using slsa-verifier before executing downloaded binaries in production.**:
   - Verify attestation using slsa-verifier before executing downloaded binaries in production.

## Recommended Tools & Environments
- SLSA v1.0
- slsa-github-generator
- in-toto
- GitHub Actions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
