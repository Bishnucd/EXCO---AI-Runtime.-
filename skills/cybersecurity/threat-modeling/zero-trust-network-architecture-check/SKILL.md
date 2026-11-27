---
name: zero-trust-network-architecture-check
description: Assesses network topology and access controls against NIST SP 800-207 Zero Trust Architecture principles. Use when evaluating enterprise security posture and microsegmentation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://csrc.nist.gov/publications/detail/sp/800-207/final"
---
# Zero Trust Network Architecture Check

## Overview
Zero Trust assumes network perimeters are breached. Every access request must be explicitly verified, granted least-privilege access, and continuously inspected.

## Operational Workflow

1. **Verify mutual TLS (mTLS) enforcement for all inter-service communications.**:
   - Verify mutual TLS (mTLS) enforcement for all inter-service communications.

2. **Check context-aware conditional access policies (device health, IP risk, MFA status).**:
   - Check context-aware conditional access policies (device health, IP risk, MFA status).

3. **Evaluate microsegmentation boundaries preventing lateral network movement.**:
   - Evaluate microsegmentation boundaries preventing lateral network movement.

4. **Generate compliance scorecards rating network posture against NIST Zero Trust tenets.**:
   - Generate compliance scorecards rating network posture against NIST Zero Trust tenets.

## Recommended Tools & Environments
- NIST 800-207
- mTLS
- IAM
- Cloud Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
