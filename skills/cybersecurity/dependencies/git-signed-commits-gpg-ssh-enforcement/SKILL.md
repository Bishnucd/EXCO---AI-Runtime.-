---
name: git-signed-commits-gpg-ssh-enforcement
description: Configures GPG or SSH cryptographic commit signing and branch protection rules requiring verified commits. Use when preventing commit author spoofing and identity impersonation in git.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification"
---
# Git Signed Commits Gpg Ssh Enforcement

## Overview
Anyone can configure git config user.email to impersonate any author. Enforcing cryptographic GPG or SSH commit signatures guarantees that commits originated from authorized team members.

## Operational Workflow

1. **Generate dedicated ed25519 SSH signing key on developer hardware.**:
   - Generate dedicated ed25519 SSH signing key on developer hardware.

2. **Configure git config --global gpg.format ssh and user.signingkey.**:
   - Configure git config --global gpg.format ssh and user.signingkey.

3. **Upload public signing key to GitHub user profile with Signing Key scope.**:
   - Upload public signing key to GitHub user profile with Signing Key scope.

4. **Enable "Require signed commits" branch protection rule in GitHub repository settings.**:
   - Enable "Require signed commits" branch protection rule in GitHub repository settings.

## Recommended Tools & Environments
- SSH Commit Signing
- GPG Signing
- GitHub Branch Protection
- Git

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
