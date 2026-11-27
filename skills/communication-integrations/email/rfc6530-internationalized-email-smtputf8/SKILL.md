---
name: rfc6530-internationalized-email-smtputf8
description: Implements SMTPUTF8 and internationalized domain name (IDN) punycode handling per RFC 6530. Use when supporting non-Latin foreign language email addresses and character sets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc6530"
---
# Rfc6530 Internationalized Email Smtputf8

## Overview
Standard legacy SMTP rejects non-ASCII email addresses. Implementing SMTPUTF8 and IDN punycode conversions ensures global users with accented, Cyrillic, Chinese, or Arabic emails can register.

## Operational Workflow

1. **Convert domain portions of internationalized emails to ASCII using Punycode (IDNA 2008).**:
   - Convert domain portions of internationalized emails to ASCII using Punycode (IDNA 2008).

2. **Verify that mail transfer agent supports SMTPUTF8 extension during EHLO handshake.**:
   - Verify that mail transfer agent supports SMTPUTF8 extension during EHLO handshake.

3. **Encode non-ASCII display names and subject headers using RFC 2047 MIME encoded-words.**:
   - Encode non-ASCII display names and subject headers using RFC 2047 MIME encoded-words.

4. **Ensure database column collations (utf8mb4) support full multi-byte Unicode characters.**:
   - Ensure database column collations (utf8mb4) support full multi-byte Unicode characters.

## Recommended Tools & Environments
- RFC 6530 / RFC 6531
- Punycode
- SMTPUTF8
- Unicode

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
