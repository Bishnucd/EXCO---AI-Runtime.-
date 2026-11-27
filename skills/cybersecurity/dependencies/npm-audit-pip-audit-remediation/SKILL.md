---
name: npm-audit-pip-audit-remediation
description: Runs language-native dependency vulnerability audits and automated security fix commands (npm audit, pip-audit). Use when identifying and patching vulnerabilities in project package manifests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/pypa/pip-audit"
---
# Npm Audit Pip Audit Remediation

## Overview
Native package managers integrate security advisory checking. Running automated audit tools scans lockfile trees and calculates minimal dependency version upgrades that resolve CVEs without breaking builds.

## Operational Workflow

1. **Execute npm audit --audit-level=high or pip-audit in local development environment.**:
   - Execute npm audit --audit-level=high or pip-audit in local development environment.

2. **Analyze advisory details**:
   - Analyze advisory details: vulnerable versions, fixed versions, and exploit paths.

3. **Execute automated non-breaking patch commands (npm audit fix).**:
   - Execute automated non-breaking patch commands (npm audit fix).

4. **Manually override deep transitive dependencies using package overrides or resolutions blocks.**:
   - Manually override deep transitive dependencies using package overrides or resolutions blocks.

## Recommended Tools & Environments
- npm audit
- pip-audit
- Node.js / Python
- PyPI Advisory DB

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
