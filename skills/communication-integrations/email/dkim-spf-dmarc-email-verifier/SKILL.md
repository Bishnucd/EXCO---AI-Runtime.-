---
name: dkim-spf-dmarc-email-verifier
description: Inspects and validates SPF, DKIM, and DMARC DNS records to ensure high email deliverability and spoof defense. Use when configuring or diagnosing email deliverability and domain authentication.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://dmarc.org/overview/"
---
# Dkim Spf Dmarc Email Verifier

## Overview
Modern email providers reject or spam-folder messages lacking valid authentication. Verifying SPF include directives, DKIM 2048-bit keys, and DMARC enforcement policies guarantees delivery.

## Operational Workflow

1. **Query DNS TXT records for domain SPF policy and verify IP inclusion limits (<= 10 lookups).**:
   - Query DNS TXT records for domain SPF policy and verify IP inclusion limits (<= 10 lookups).

2. **Validate DKIM selector records and cryptographic public key match with signing servers.**:
   - Validate DKIM selector records and cryptographic public key match with signing servers.

3. **Check DMARC policy progression (none -> quarantine -> reject) and rua aggregate reporting.**:
   - Check DMARC policy progression (none -> quarantine -> reject) and rua aggregate reporting.

4. **Send synthetic probe emails to test mailboxes to verify authentication alignment headers.**:
   - Send synthetic probe emails to test mailboxes to verify authentication alignment headers.

## Recommended Tools & Environments
- DNS
- SPF
- DKIM
- DMARC
- dig / nslookup

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
