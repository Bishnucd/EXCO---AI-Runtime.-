---
name: owasp-top-10-api-audit
description: Audits API architecture and implementation against OWASP Top 10 API Security Risks (BOLA, Broken Auth, SSRF). Use when conducting comprehensive security reviews of web and mobile backend APIs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://owasp.org/API-Security/"
---
# Owasp Top 10 Api Audit

## Overview
API attacks bypass traditional network perimeters by exploiting business logic flaws like Broken Object Level Authorization (BOLA). A structured audit verifies defenses against top 10 vectors.

## Operational Workflow

1. **Audit authorization checks on object-level resource identifiers (API1**:
   - Audit authorization checks on object-level resource identifiers (API1: BOLA).

2. **Verify token verification, rotation, and secret strength (API2**:
   - Verify token verification, rotation, and secret strength (API2: Broken Authentication).

3. **Inspect object properties to prevent mass assignment vulnerabilities (API3**:
   - Inspect object properties to prevent mass assignment vulnerabilities (API3: Broken Object Property Level Auth).

4. **Test rate limiting, request size limits, and egress network rules against SSRF (API8**:
   - Test rate limiting, request size limits, and egress network rules against SSRF (API8: Security Misconfiguration).

## Recommended Tools & Environments
- OWASP API Security
- REST APIs
- Postman / Burp Suite
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
