---
name: tls-cipher-suite-hsts-hardening-auditor
description: Audits web server TLS configurations, cipher suite suites, and HTTP Strict Transport Security (HSTS) headers. Use when achieving A+ ratings on Qualys SSL Labs security tests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ssl-config.mozilla.org/"
---
# Tls Cipher Suite Hsts Hardening Auditor

## Overview
Legacy TLS 1.0/1.1 protocols and weak CBC cipher suites allow eavesdropping and downgrade attacks. Hardening configurations to TLS 1.2/1.3 with HSTS preload headers guarantees encryption.

## Operational Workflow

1. **Disable legacy SSLv3, TLS 1.0, and TLS 1.1 protocols in web server configs (Nginx, Caddy).**:
   - Disable legacy SSLv3, TLS 1.0, and TLS 1.1 protocols in web server configs (Nginx, Caddy).

2. **Configure modern cipher suites prioritizing ChaCha20-Poly1305 and AES-256-GCM.**:
   - Configure modern cipher suites prioritizing ChaCha20-Poly1305 and AES-256-GCM.

3. **Inject Strict-Transport-Security header**:
   - Inject Strict-Transport-Security header: max-age=63072000; includeSubDomains; preload.

4. **Execute testssl.sh or SSL Labs API scan to verify zero insecure cipher vulnerabilities.**:
   - Execute testssl.sh or SSL Labs API scan to verify zero insecure cipher vulnerabilities.

## Recommended Tools & Environments
- Mozilla SSL Configuration Generator
- HSTS
- TLS 1.3
- testssl.sh

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
