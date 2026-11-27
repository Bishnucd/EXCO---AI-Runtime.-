---
name: disposable-burner-email-detector
description: Validates and rejects temporary, disposable "throwaway" email domains during user signup. Use when preventing fraud, duplicate trial accounts, and fake user registrations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/disposable-email-domains/disposable-email-domains"
---
# Disposable Burner Email Detector

## Overview
Fraudsters use disposable email services (10MinuteMail, GuerrillaMail) to abuse free trials and create spam accounts. Checking signup domains against verified blocklists blocks burner addresses.

## Operational Workflow

1. **Extract domain name from submitted user registration email address.**:
   - Extract domain name from submitted user registration email address.

2. **Query cached high-performance in-memory Set of 30,000+ known disposable domains.**:
   - Query cached high-performance in-memory Set of 30,000+ known disposable domains.

3. **Perform DNS MX query to detect disposable providers sharing MX servers across obscure domain names.**:
   - Perform DNS MX query to detect disposable providers sharing MX servers across obscure domain names.

4. **Reject registration with friendly message requesting a permanent business or personal email.**:
   - Reject registration with friendly message requesting a permanent business or personal email.

## Recommended Tools & Environments
- Disposable Email Blocklist
- DNS MX Lookup
- Regex
- Node.js / Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
