---
name: csp-nonce-content-security-policy
description: Configures strict Content Security Policy (CSP) headers with cryptographic per-request nonces and trusted types. Use when neutralizing Cross-Site Scripting (XSS) in modern web applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy"
---
# Csp Nonce Content Security Policy

## Overview
Traditional domain whitelist CSPs are easily bypassed via CDN script gadgets. Strict nonce-based CSP allows only script tags bearing a cryptographically random, per-request base64 nonce token.

## Operational Workflow

1. **Generate cryptographically secure 128-bit random base64 nonce in HTTP response middleware.**:
   - Generate cryptographically secure 128-bit random base64 nonce in HTTP response middleware.

2. **Inject nonce into Content-Security-Policy header**:
   - Inject nonce into Content-Security-Policy header: script-src "nonce-{NONCE}" "strict-dynamic".

3. **Attach matching nonce="{NONCE}" attribute to all inline <script> tags rendered by the server.**:
   - Attach matching nonce="{NONCE}" attribute to all inline <script> tags rendered by the server.

4. **Configure CSP report-to endpoints to log violation attempts without breaking user experiences.**:
   - Configure CSP report-to endpoints to log violation attempts without breaking user experiences.

## Recommended Tools & Environments
- Content Security Policy (CSP)
- Cryptographic Nonces
- DOMPurify
- HTTP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
