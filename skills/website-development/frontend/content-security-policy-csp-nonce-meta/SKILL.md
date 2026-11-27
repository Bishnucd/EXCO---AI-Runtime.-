---
name: content-security-policy-csp-nonce-meta
description: Enforces strict Content Security Policy (CSP) with cryptographic script nonces to prevent Cross-Site Scripting (XSS). Use when hardening modern web applications against code injection.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
---
# Content Security Policy Csp Nonce Meta

## Overview
Allowing unsafe-inline in CSP leaves websites vulnerable to stored and reflected XSS. Generating a unique cryptographic random nonce per request ensures browsers only execute authorized scripts.

## Operational Workflow

1. **Generate cryptographically secure 128-bit random base64 nonce on backend for every HTTP request.**:
   - Generate cryptographically secure 128-bit random base64 nonce on backend for every HTTP request.

2. **Set Content-Security-Policy header**:
   - Set Content-Security-Policy header: script-src 'nonce-{NONCE}' 'strict-dynamic'; object-src 'none'.

3. **Pass nonce attribute to all legitimate inline script tags**:
   - Pass nonce attribute to all legitimate inline script tags: <script nonce="{NONCE}">.

4. **Verify that injected inline scripts lacking the valid nonce are blocked immediately by the browser.**:
   - Verify that injected inline scripts lacking the valid nonce are blocked immediately by the browser.

## Recommended Tools & Environments
- Content Security Policy (CSP)
- Cryptographic Nonces
- XSS Mitigation
- Web Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
