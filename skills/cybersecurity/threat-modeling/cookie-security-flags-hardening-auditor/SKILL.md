---
name: cookie-security-flags-hardening-auditor
description: Audits HTTP session cookies for Secure, HttpOnly, SameSite, and __Host- prefix security attributes. Use when protecting browser sessions from cross-site theft and man-in-the-middle attacks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies"
---
# Cookie Security Flags Hardening Auditor

## Overview
Missing cookie flags allow malicious scripts to read session tokens (XSS) or transmit cookies across domains (CSRF). Enforcing __Host- prefixes and SameSite=Lax locks cookies to secure origins.

## Operational Workflow

1. **Inspect Set-Cookie response headers across all application authentication endpoints.**:
   - Inspect Set-Cookie response headers across all application authentication endpoints.

2. **Enforce HttpOnly flag on all session cookies to prevent extraction via JavaScript XSS.**:
   - Enforce HttpOnly flag on all session cookies to prevent extraction via JavaScript XSS.

3. **Enforce Secure flag ensuring cookies transmit strictly over TLS encrypted connections.**:
   - Enforce Secure flag ensuring cookies transmit strictly over TLS encrypted connections.

4. **Adopt __Host- prefix (e.g. __Host-SessionId) ensuring cookies are bound to path / and origin.**:
   - Adopt __Host- prefix (e.g. __Host-SessionId) ensuring cookies are bound to path / and origin.

## Recommended Tools & Environments
- HTTP Cookie Flags
- SameSite
- __Host- Prefix
- Express / Django

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
