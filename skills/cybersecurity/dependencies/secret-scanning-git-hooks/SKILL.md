---
name: secret-scanning-git-hooks
description: Installs pre-commit Git hooks and CI scanners to prevent hardcoded API keys, tokens, and secrets from entering repos. Use when safeguarding source code repositories from credential leakage.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/gitleaks/gitleaks"
---
# Secret Scanning Git Hooks

## Overview
Accidental secret commits cause severe cloud account compromises. Pre-commit hooks run regex and entropy checks locally before commits are saved, blocking leaked credentials.

## Operational Workflow

1. **Configure .gitleaks.toml with rules for AWS keys, private keys, JWT tokens, and SaaS secrets.**:
   - Configure .gitleaks.toml with rules for AWS keys, private keys, JWT tokens, and SaaS secrets.

2. **Install pre-commit hook script executing gitleaks protect --staged on every git commit.**:
   - Install pre-commit hook script executing gitleaks protect --staged on every git commit.

3. **Enforce secondary server-side scan in CI workflows to catch bypassed client hooks.**:
   - Enforce secondary server-side scan in CI workflows to catch bypassed client hooks.

4. **Provide safe secret revocation and rotation playbooks if a credential was ever committed.**:
   - Provide safe secret revocation and rotation playbooks if a credential was ever committed.

## Recommended Tools & Environments
- Gitleaks
- Git Hooks
- Regex
- GitHub Actions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
