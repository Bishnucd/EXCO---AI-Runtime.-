---
name: ssrf-server-side-request-forgery-defense
description: Validates outbound HTTP requests, restricts DNS rebinding, and isolates cloud metadata IP endpoints (169.254.169.254). Use when protecting services that fetch user-supplied URLs from SSRF.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html"
---
# Ssrf Server Side Request Forgery Defense

## Overview
Services that fetch user URLs (webhooks, image unfurling) risk SSRF attacks targeting cloud metadata (AWS IMDS) or internal network databases. Strict IP validation and network egress controls block access.

## Operational Workflow

1. **Resolve target hostname to IP address before establishing outbound socket connections.**:
   - Resolve target hostname to IP address before establishing outbound socket connections.

2. **Validate resolved IP against private IP ranges (RFC 1918, RFC 3927 cloud metadata 169.254.169.254, loopback).**:
   - Validate resolved IP against private IP ranges (RFC 1918, RFC 3927 cloud metadata 169.254.169.254, loopback).

3. **Pin socket connection directly to validated IP to neutralize DNS rebinding attacks.**:
   - Pin socket connection directly to validated IP to neutralize DNS rebinding attacks.

4. **Execute external HTTP fetch through dedicated egress proxy or isolated VPC network container.**:
   - Execute external HTTP fetch through dedicated egress proxy or isolated VPC network container.

## Recommended Tools & Environments
- OWASP SSRF Cheat Sheet
- DNS Rebinding Defense
- Network Egress
- Python / Go

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
