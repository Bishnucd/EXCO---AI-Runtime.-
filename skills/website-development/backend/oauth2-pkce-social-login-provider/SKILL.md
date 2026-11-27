---
name: oauth2-pkce-social-login-provider
description: Implements OAuth2 Authorization Code Grant with Proof Key for Code Exchange (PKCE) for social login. Use when authenticating users securely via Google, GitHub, and Apple.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://oauth.net/2/pkce/"
---
# Oauth2 Pkce Social Login Provider

## Overview
Standard authorization code grants are vulnerable to authorization code interception on mobile and single-page apps. PKCE generates cryptographic verifiers and challenges to guarantee origin authenticity.

## Operational Workflow

1. **Generate high-entropy code_verifier string and compute code_challenge = base64url(sha256(code_verifier)).**:
   - Generate high-entropy code_verifier string and compute code_challenge = base64url(sha256(code_verifier)).

2. **Redirect user to Identity Provider (Google/GitHub) with code_challenge and code_challenge_method=S256.**:
   - Redirect user to Identity Provider (Google/GitHub) with code_challenge and code_challenge_method=S256.

3. **Receive authorization code on redirect callback and exchange for tokens passing the raw code_verifier.**:
   - Receive authorization code on redirect callback and exchange for tokens passing the raw code_verifier.

4. **IdP verifies SHA-256 hash match, issuing identity ID token and access token securely.**:
   - IdP verifies SHA-256 hash match, issuing identity ID token and access token securely.

## Recommended Tools & Environments
- OAuth2 / PKCE
- Social Login
- OpenID Connect
- Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
