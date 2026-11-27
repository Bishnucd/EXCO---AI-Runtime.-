---
name: package-lock-integrity-hash-auditor
description: Audits package-lock.json and yarn.lock files for missing integrity hashes, git URLs, and registry poisoning. Use when preventing lockfile injection and dependency confusion attacks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json"
---
# Package Lock Integrity Hash Auditor

## Overview
Malicious pull requests can silently alter package-lock.json URLs to point to compromised private servers. Verifying subresource integrity hashes (integrity: sha512) and registries prevents poisoning.

## Operational Workflow

1. **Parse package-lock.json resolving all resolved package download URLs.**:
   - Parse package-lock.json resolving all resolved package download URLs.

2. **Assert that all URLs strictly point to approved enterprise registries (e.g. registry.npmjs.org).**:
   - Assert that all URLs strictly point to approved enterprise registries (e.g. registry.npmjs.org).

3. **Verify that every package entry possesses a valid SHA-512 integrity subresource hash.**:
   - Verify that every package entry possesses a valid SHA-512 integrity subresource hash.

4. **Reject commits introducing unhashed packages or arbitrary external git branch URLs.**:
   - Reject commits introducing unhashed packages or arbitrary external git branch URLs.

## Recommended Tools & Environments
- Lockfile Auditing
- SHA-512 SRI
- Python / Node.js
- Supply Chain

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
