---
name: sbom-generation-cyclonedx
description: Generates standardized Software Bill of Materials (SBOM) in CycloneDX JSON format from project dependency graphs. Use when providing software transparency and complying with supply chain security standards.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cyclonedx.org/specification/overview/"
---
# Sbom Generation Cyclonedx

## Overview
Executive orders and enterprise clients require machine-readable SBOMs. Generating CycloneDX reports provides a complete bill of direct and transitive dependencies with cryptographic hashes.

## Operational Workflow

1. **Scan project package manifests (package-lock.json, poetry.lock, go.sum).**:
   - Scan project package manifests (package-lock.json, poetry.lock, go.sum).

2. **Resolve complete dependency tree including transitive components and license metadata.**:
   - Resolve complete dependency tree including transitive components and license metadata.

3. **Compute SHA-256 hashes for all included component packages.**:
   - Compute SHA-256 hashes for all included component packages.

4. **Emit CycloneDX v1.5 JSON SBOM artifact and validate against formal schema.**:
   - Emit CycloneDX v1.5 JSON SBOM artifact and validate against formal schema.

## Recommended Tools & Environments
- CycloneDX CLI
- Node.js / Python / Go
- JSON
- SPDX

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
