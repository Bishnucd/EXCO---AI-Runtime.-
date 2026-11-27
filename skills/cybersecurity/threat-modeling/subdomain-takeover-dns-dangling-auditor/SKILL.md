---
name: subdomain-takeover-dns-dangling-auditor
description: Scans DNS records for dangling CNAME pointers to decommissioned cloud services (S3, GitHub Pages, Heroku). Use when preventing subdomain takeover attacks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Subdomain_Takeover_Cheat_Sheet.md"
---
# Subdomain Takeover Dns Dangling Auditor

## Overview
When developers decommission an S3 bucket or Heroku app but leave the DNS CNAME record active, attackers can register the abandoned cloud bucket name and hijack the corporate subdomain.

## Operational Workflow

1. **Enumerate all active DNS CNAME records across corporate domain zones.**:
   - Enumerate all active DNS CNAME records across corporate domain zones.

2. **Query target cloud provider endpoints to detect "NoSuchBucket" or "No such app" response signatures.**:
   - Query target cloud provider endpoints to detect "NoSuchBucket" or "No such app" response signatures.

3. **Flag dangling CNAME pointers as critical vulnerabilities.**:
   - Flag dangling CNAME pointers as critical vulnerabilities.

4. **Automatically purge orphaned DNS records or re-claim placeholder cloud assets.**:
   - Automatically purge orphaned DNS records or re-claim placeholder cloud assets.

## Recommended Tools & Environments
- Subdomain Takeover
- DNS Auditing
- Python / Go
- Cloudflare DNS

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
