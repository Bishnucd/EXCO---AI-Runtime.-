---
name: rate-limiting-distributed-ddos-shield
description: Configures multi-tier Cloudflare WAF and edge rate-limiting rules to mitigate Layer 7 application DDoS attacks. Use when protecting public web services from traffic floods and credential stuffing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.cloudflare.com/waf/rate-limiting-rules/"
---
# Rate Limiting Distributed Ddos Shield

## Overview
Layer 7 application floods exhaust server CPU by targeting computationally expensive endpoints (search, login). Cloudflare edge rules track request frequency per IP/session, challenging abusive traffic.

## Operational Workflow

1. **Identify expensive application endpoints (login, password reset, full-text search).**:
   - Identify expensive application endpoints (login, password reset, full-text search).

2. **Define edge rate-limiting rules (e.g. max 20 requests per 10 seconds per IP on /api/login).**:
   - Define edge rate-limiting rules (e.g. max 20 requests per 10 seconds per IP on /api/login).

3. **Configure action response**:
   - Configure action response: Managed Challenge (interactive turnstile) or immediate HTTP 429 block.

4. **Configure IP reputation threat scoring to automatically challenge known malicious proxy networks.**:
   - Configure IP reputation threat scoring to automatically challenge known malicious proxy networks.

## Recommended Tools & Environments
- Cloudflare WAF
- Edge Rate Limiting
- HTTP/2
- Bot Management

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
