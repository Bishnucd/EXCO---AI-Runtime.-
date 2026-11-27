---
name: owasp-secure-code-review-checklist
description: Audits pull requests against the OWASP Top 10 vulnerabilities (injection, XSS, SSRF, broken auth). Use when conducting security-focused code reviews before merging to production.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://owasp.org/www-project-code-review-guide/"
---
# Owasp Secure Code Review Checklist

## Overview
Functional code reviews often overlook security vulnerabilities. The OWASP code review methodology systematically verifies input sanitization, authorization checks, and secret handling.

## Operational Workflow

1. **Check input validation**:
   - Check input validation: verify parameterized queries are used for all database and shell interactions.

2. **Check authentication and authorization**:
   - Check authentication and authorization: verify tenant ID checks exist on all data retrieval operations (BOLA/IDOR).

3. **Check output encoding**:
   - Check output encoding: ensure user-supplied data rendered in HTML or templates is securely escaped (XSS).

4. **Audit secrets and cryptography**:
   - Audit secrets and cryptography: verify no hardcoded tokens exist and secure ciphers (AES-256-GCM) are utilized.

## Recommended Tools & Environments
- OWASP Code Review
- AppSec
- Vulnerability Assessment
- Secure Coding

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
