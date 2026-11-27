---
name: employee-offboarding-access-revocation
description: Automates immediate, audit-logged credential and access revocation workflows for departing employees. Use when executing secure employee departures to prevent insider data leakage.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"
---
# Employee Offboarding Access Revocation

## Overview
Orphaned accounts of departed employees are primary vectors for security breaches. A standardized offboarding runbook revokes SSO access, invalidates API keys, and reclaims company assets on departure.

## Operational Workflow

1. **Trigger offboarding workflow upon HR departure notification timestamp.**:
   - Trigger offboarding workflow upon HR departure notification timestamp.

2. **Immediately suspend primary Identity Provider account (Okta, Google Workspace, Azure AD).**:
   - Immediately suspend primary Identity Provider account (Okta, Google Workspace, Azure AD).

3. **Revoke GitHub organization access, AWS IAM permissions, and VPN certificates.**:
   - Revoke GitHub organization access, AWS IAM permissions, and VPN certificates.

4. **Initiate remote MDM device wipe of corporate data and log completed revocation timestamps for audit.**:
   - Initiate remote MDM device wipe of corporate data and log completed revocation timestamps for audit.

## Recommended Tools & Environments
- NIST SP 800-53 AC-2
- Okta / Azure AD
- GitHub API
- Markdown Checklists

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
