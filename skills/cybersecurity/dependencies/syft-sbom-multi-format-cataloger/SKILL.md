---
name: syft-sbom-multi-format-cataloger
description: Generates detailed Software Bill of Materials (SBOM) across container images and filesystems using Anchore Syft. Use when cataloging packages, licenses, and file digests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/anchore/syft"
---
# Syft Sbom Multi Format Cataloger

## Overview
Syft inspects container layers and language package manifests (npm, pip, cargo, go), cataloging deep nested dependencies into standard SPDX or CycloneDX JSON documents in seconds.

## Operational Workflow

1. **Execute syft packages <container_image> -o cyclonedx-json=sbom.json.**:
   - Execute syft packages <container_image> -o cyclonedx-json=sbom.json.

2. **Inspect detected package catalog for OS packages (rpm, deb, apk) and application libraries.**:
   - Inspect detected package catalog for OS packages (rpm, deb, apk) and application libraries.

3. **Extract package licenses, authors, and cryptographic component file digests.**:
   - Extract package licenses, authors, and cryptographic component file digests.

4. **Archive SBOM alongside build artifacts for downstream vulnerability querying.**:
   - Archive SBOM alongside build artifacts for downstream vulnerability querying.

## Recommended Tools & Environments
- Anchore Syft
- SPDX / CycloneDX
- Container Images
- CLI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
