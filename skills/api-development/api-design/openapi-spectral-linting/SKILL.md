---
name: openapi-spectral-linting
description: Enforces corporate API style guides and OAS best practices using Spectral rulesets. Use when linting OpenAPI specifications for naming conventions, tags, and status codes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://stoplight.io/open-source/spectral"
---
# Openapi Spectral Linting

## Overview
Inconsistent API design across teams creates developer friction. Spectral automates linting rules for URL casings, error responses, description presence, and tag taxonomies.

## Operational Workflow

1. **Create .spectral.yaml extending recommended rulesets (spectral**:
   - Create .spectral.yaml extending recommended rulesets (spectral:oas).

2. **Define custom rules enforcing camelCase/kebab-case naming, mandatory RFC 7807 error models, and descriptions.**:
   - Define custom rules enforcing camelCase/kebab-case naming, mandatory RFC 7807 error models, and descriptions.

3. **Execute spectral lint openapi.yaml in automated CI pull request checks.**:
   - Execute spectral lint openapi.yaml in automated CI pull request checks.

4. **Export JUnit or SARIF violation reports to block merges containing non-compliant API designs.**:
   - Export JUnit or SARIF violation reports to block merges containing non-compliant API designs.

## Recommended Tools & Environments
- Spectral CLI
- OpenAPI 3.1
- Node.js
- YAML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
