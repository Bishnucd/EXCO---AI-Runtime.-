---
name: design-system-release-versioning-governance
description: Establishes SemVer versioning, deprecation policies, and RFC review governance for design systems. Use when managing enterprise component library releases across product teams.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://semver.org/"
---
# Design System Release Versioning Governance

## Overview
Design systems fail when component updates break consuming applications unexpectedly. Strict Semantic Versioning (SemVer), Request for Comments (RFC) proposals, and deprecation cycles build trust.

## Operational Workflow

1. **Establish RFC proposal template for requesting new components, props, or token modifications.**:
   - Establish RFC proposal template for requesting new components, props, or token modifications.

2. **Follow SemVer strictly**:
   - Follow SemVer strictly: PATCH for visual bug fixes, MINOR for new components/props, MAJOR for breaking DOM changes.

3. **Maintain minimum 2-minor-version deprecation warnings in console before deleting deprecated component props.**:
   - Maintain minimum 2-minor-version deprecation warnings in console before deleting deprecated component props.

4. **Publish detailed migration guides and automated codemods alongside major version releases.**:
   - Publish detailed migration guides and automated codemods alongside major version releases.

## Recommended Tools & Environments
- Design System Governance
- SemVer
- RFC Process
- Deprecation Lifecycle

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
