---
name: container-image-trivy-scanner
description: Scans container base images and application layers for known CVE vulnerabilities and misconfigurations using Trivy. Use when securing container build pipelines in CI/CD.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://aquasecurity.github.io/trivy/"
---
# Container Image Trivy Scanner

## Overview
Container images often inherit hundreds of OS-level vulnerabilities from base layers. Trivy scans operating system packages and language dependencies, failing builds that breach severity thresholds.

## Operational Workflow

1. **Execute trivy image --severity HIGH,CRITICAL on newly built container images.**:
   - Execute trivy image --severity HIGH,CRITICAL on newly built container images.

2. **Filter out unfixed vulnerabilities or generate structured exception justifications.**:
   - Filter out unfixed vulnerabilities or generate structured exception justifications.

3. **Output vulnerability findings in SARIF format for integration into GitHub Security tab.**:
   - Output vulnerability findings in SARIF format for integration into GitHub Security tab.

4. **Block deployment pipelines if unresolved critical CVEs exist in the image manifest.**:
   - Block deployment pipelines if unresolved critical CVEs exist in the image manifest.

## Recommended Tools & Environments
- Trivy
- Docker
- SARIF
- GitHub Actions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
