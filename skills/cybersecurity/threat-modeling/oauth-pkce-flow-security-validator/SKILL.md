---
name: oauth-pkce-flow-security-validator
description: Validates OAuth 2.1 authorization code flow with Proof Key for Code Exchange (PKCE) for client applications. Use when securing single-page and mobile apps against authorization code interception.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc7636"
---
# Oauth Pkce Flow Security Validator

## Overview
Mobile and single-page apps cannot securely store client secrets. OAuth 2.1 mandates PKCE (code_verifier and code_challenge) to prevent authorization code theft.

## Operational Workflow

1. **Generate cryptographically secure high-entropy code_verifier strings (43-128 characters).**:
   - Generate cryptographically secure high-entropy code_verifier strings (43-128 characters).

2. **Compute SHA-256 code_challenge and pass code_challenge_method=S256 in authorization URL.**:
   - Compute SHA-256 code_challenge and pass code_challenge_method=S256 in authorization URL.

3. **Exchange authorization code alongside original code_verifier at the token endpoint.**:
   - Exchange authorization code alongside original code_verifier at the token endpoint.

4. **Verify token responses contain strict audience (aud), issuer (iss), and expiry constraints.**:
   - Verify token responses contain strict audience (aud), issuer (iss), and expiry constraints.

## Recommended Tools & Environments
- OAuth 2.1
- PKCE
- SHA-256
- Crypto

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
