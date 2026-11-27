---
name: error-code-troubleshooting-guide-authoring
description: Writes structured HTTP error code catalogs with root cause explanations and exact remediation steps. Use when reducing developer support ticket volume for failed API requests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/List_of_HTTP_status_codes"
---
# Error Code Troubleshooting Guide Authoring

## Overview
Vague error messages ("Bad Request") waste developer hours. A comprehensive error catalog documents machine-readable error codes, root causes, sample error payloads, and step-by-step fixes.

## Operational Workflow

1. **Catalog all domain error codes emitted by API (e.g., ERR_INSUFFICIENT_FUNDS, ERR_RATE_LIMITED).**:
   - Catalog all domain error codes emitted by API (e.g., ERR_INSUFFICIENT_FUNDS, ERR_RATE_LIMITED).

2. **Structure each error entry**:
   - Structure each error entry: HTTP Status, Error Code, Meaning, Common Root Causes, How to Fix.

3. **Provide example error JSON response adhering to RFC 7807 Problem Details standards.**:
   - Provide example error JSON response adhering to RFC 7807 Problem Details standards.

4. **Link error codes directly from API response documentation for instant troubleshooting.**:
   - Link error codes directly from API response documentation for instant troubleshooting.

## Recommended Tools & Environments
- Error Documentation
- Troubleshooting Guides
- Developer Support
- RFC 7807

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
