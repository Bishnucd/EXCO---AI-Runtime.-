---
name: jwt-stateless-session-authenticator
description: Implements stateless JWT token authentication with short-lived access tokens and sliding refresh tokens. Use when securing stateless web API backends and SPAs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://auth0.com/docs/secure/tokens/json-web-tokens"
---
# Jwt Stateless Session Authenticator

## Overview
Stateless JWT auth scales horizontally across microservices. Pairing 15-minute access tokens with HttpOnly refresh tokens stored in Redis enables instant revocation while avoiding database lookups on every call.

## Operational Workflow

1. **Issue signed JWT access token (15-min expiry) containing user ID, role, and permissions claims.**:
   - Issue signed JWT access token (15-min expiry) containing user ID, role, and permissions claims.

2. **Generate cryptographically random refresh token and store in HttpOnly, Secure, SameSite=Lax cookie.**:
   - Generate cryptographically random refresh token and store in HttpOnly, Secure, SameSite=Lax cookie.

3. **Implement middleware verifying JWT signature, expiration, and issuer on protected routes.**:
   - Implement middleware verifying JWT signature, expiration, and issuer on protected routes.

4. **Expose /auth/refresh endpoint exchanging valid refresh tokens for fresh access tokens.**:
   - Expose /auth/refresh endpoint exchanging valid refresh tokens for fresh access tokens.

## Recommended Tools & Environments
- JWT (JSON Web Tokens)
- Node.js / Python
- Cryptographic HMAC/RSA
- HTTP-Only Cookies

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
