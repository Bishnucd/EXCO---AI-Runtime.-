---
name: dns-domain-age-reputation-security-audit
description: Audits domain age, registrar history, and DNSBL blacklist status to detect newly registered phishing infrastructure. Use when evaluating suspicious partner links and email sender legitimacy.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/DNSBL"
---
# Dns Domain Age Reputation Security Audit

## Overview
Phishing and scam operations register domains days before launching campaigns. Auditing domain registration age and querying major DNS Blackhole Lists (Spamhaus, SURBL) exposes malicious sites.

## Operational Workflow

1. **Query domain WHOIS record to determine exact domain creation date and registration registrar.**:
   - Query domain WHOIS record to determine exact domain creation date and registration registrar.

2. **Calculate domain age in days; flag any domain registered less than 30 days ago as high risk.**:
   - Calculate domain age in days; flag any domain registered less than 30 days ago as high risk.

3. **Query DNSBL reputation blacklists (Spamhaus ZEN, Barracuda, SURBL) via DNS lookup.**:
   - Query DNSBL reputation blacklists (Spamhaus ZEN, Barracuda, SURBL) via DNS lookup.

4. **Inspect VirusTotal domain reputation score and historical malware telemetry associations.**:
   - Inspect VirusTotal domain reputation score and historical malware telemetry associations.

## Recommended Tools & Environments
- Domain Age Verification
- DNSBL Blacklists
- SecurityTrails / VirusTotal
- Cybersecurity

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
