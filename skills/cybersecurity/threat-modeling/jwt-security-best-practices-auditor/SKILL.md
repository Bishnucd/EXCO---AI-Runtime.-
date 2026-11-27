---
name: jwt-security-best-practices-auditor
description: Audits JSON Web Token (JWT) implementations against common cryptographic flaws (alg: none, weak HMAC secrets, jku injection). Use when hardening token-based authentication services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc8725"
---
# Jwt Security Best Practices Auditor

## Overview
Misconfigured JWT libraries allow attackers to bypass authentication by altering algorithms to "none" or injecting external public keys via jku headers. Strict verification prevents token forgery.

## Operational Workflow

1. **Enforce explicit algorithm whitelisting (RS256 or ES256 only; never accept algorithm from token header).**:
   - Enforce explicit algorithm whitelisting (RS256 or ES256 only; never accept algorithm from token header).

2. **Reject tokens with alg**:
   - Reject tokens with alg: "none" or algorithm confusion attacks (HMAC verification using public RSA keys).

3. **Validate strict token claims**:
   - Validate strict token claims: exp (expiration), nbf (not before), iss (issuer), and aud (audience).

4. **Ensure asymmetric signing keys are at least 2048-bit RSA or 256-bit elliptic curves (P-256).**:
   - Ensure asymmetric signing keys are at least 2048-bit RSA or 256-bit elliptic curves (P-256).

## Recommended Tools & Environments
- RFC 8725 JWT Best Practices
- Cryptography
- JWT
- Python / Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
