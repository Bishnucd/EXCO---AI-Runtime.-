---
name: security-txt-disclosure-policy-authoring
description: Authors and publishes standard RFC 9116 security.txt files defining vulnerability disclosure and PGP reporting policies. Use when establishing authorized, responsible vulnerability reporting channels.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.rfc-editor.org/rfc/rfc9116"
---
# Security Txt Disclosure Policy Authoring

## Overview
Security researchers need a direct, authorized path to report vulnerabilities before public disclosure. RFC 9116 standardizes Contact, Encryption, and Policy URLs at /.well-known/security.txt.

## Operational Workflow

1. **Author security.txt containing mandatory Contact (mailto**:
   - Author security.txt containing mandatory Contact (mailto: or web form) and Expires timestamps.

2. **Include Encryption link pointing to corporate PGP public key for encrypted reporting.**:
   - Include Encryption link pointing to corporate PGP public key for encrypted reporting.

3. **Link to formal Vulnerability Disclosure Policy outlining safe harbor terms for ethical hackers.**:
   - Link to formal Vulnerability Disclosure Policy outlining safe harbor terms for ethical hackers.

4. **Sign the security.txt file with corporate PGP key and host at https**:
   - Sign the security.txt file with corporate PGP key and host at https://domain/.well-known/security.txt.

## Recommended Tools & Environments
- RFC 9116 security.txt
- PGP / GPG
- Vulnerability Disclosure
- HTTP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
