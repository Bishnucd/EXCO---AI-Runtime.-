---
name: osint-domain-whois-dns-infrastructure-audit
description: Investigates domain ownership, historical WHOIS, DNS records, and SSL certificates using Open Source Intelligence (OSINT). Use when tracing corporate digital footprints and malicious infrastructure.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.securitytrails.com/corp/api"
---
# Osint Domain Whois Dns Infrastructure Audit

## Overview
Digital infrastructure leaves permanent public footprints. Analyzing historical WHOIS records, passive DNS databases, and Certificate Transparency (CT) logs reveals hidden parent companies and infrastructure.

## Operational Workflow

1. **Query Certificate Transparency logs (crt.sh) to discover all registered subdomains and wildcard certificates.**:
   - Query Certificate Transparency logs (crt.sh) to discover all registered subdomains and wildcard certificates.

2. **Retrieve historical DNS records (A, MX, TXT, NS) to map hosting providers and mail infrastructure changes.**:
   - Retrieve historical DNS records (A, MX, TXT, NS) to map hosting providers and mail infrastructure changes.

3. **Inspect historical WHOIS records prior to privacy redaction to identify original registrant corporate entities.**:
   - Inspect historical WHOIS records prior to privacy redaction to identify original registrant corporate entities.

4. **Cross-reference IP address ranges and BGP Autonomous System Numbers (ASN) to map corporate server footprint.**:
   - Cross-reference IP address ranges and BGP Autonomous System Numbers (ASN) to map corporate server footprint.

## Recommended Tools & Environments
- OSINT
- WHOIS History
- DNS Reconnaissance
- SecurityTrails / crt.sh

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
