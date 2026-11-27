---
name: cors-csrf-security-hardening
description: Configures secure Cross-Origin Resource Sharing (CORS) headers and SameSite CSRF defense tokens. Use when hardening web applications against cross-site request forgery and data exfiltration.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
---
# Cors Csrf Security Hardening

## Overview
Wildcard CORS origins and missing CSRF tokens allow malicious websites to hijack authenticated user sessions. Strict header configurations protect user data.

## Operational Workflow

1. **Restrict Access-Control-Allow-Origin to explicit whitelist origins (never * with credentials).**:
   - Restrict Access-Control-Allow-Origin to explicit whitelist origins (never * with credentials).

2. **Set SameSite=Lax or SameSite=Strict and Secure flags on all session and authentication cookies.**:
   - Set SameSite=Lax or SameSite=Strict and Secure flags on all session and authentication cookies.

3. **Implement double-submit cookie or synchronized anti-CSRF token verification on state-changing requests.**:
   - Implement double-submit cookie or synchronized anti-CSRF token verification on state-changing requests.

4. **Validate pre-flight OPTIONS request handling and cache duration headers.**:
   - Validate pre-flight OPTIONS request handling and cache duration headers.

## Recommended Tools & Environments
- HTTP Headers
- SameSite Cookies
- CSRF Tokens
- Express / Django

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
