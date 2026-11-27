---
name: bimi-brand-indicator-svg-setup
description: Configures Brand Indicators for Message Identification (BIMI) with Verified Mark Certificates (VMC). Use when displaying verified brand logos directly beside emails in mobile inboxes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://bimigroup.org/"
---
# Bimi Brand Indicator Svg Setup

## Overview
BIMI allows verified organizations to display official brand logos in Gmail, Apple Mail, and Yahoo inboxes. Implementing strict DMARC, SVG Tiny 1.2 logos, and VMC certificates builds brand trust.

## Operational Workflow

1. **Verify that domain enforces strict DMARC policy (p=reject or p=quarantine with pct=100).**:
   - Verify that domain enforces strict DMARC policy (p=reject or p=quarantine with pct=100).

2. **Format corporate vector logo adhering strictly to SVG Tiny Portable/Secure profile constraints.**:
   - Format corporate vector logo adhering strictly to SVG Tiny Portable/Secure profile constraints.

3. **Acquire Verified Mark Certificate (VMC) from authorized CA validating trademark ownership.**:
   - Acquire Verified Mark Certificate (VMC) from authorized CA validating trademark ownership.

4. **Publish DNS TXT record at default._bimi.domain pointing to SVG logo and VMC certificate PEM.**:
   - Publish DNS TXT record at default._bimi.domain pointing to SVG logo and VMC certificate PEM.

## Recommended Tools & Environments
- BIMI
- VMC (Verified Mark Certificate)
- SVG Tiny 1.2
- DNS

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
