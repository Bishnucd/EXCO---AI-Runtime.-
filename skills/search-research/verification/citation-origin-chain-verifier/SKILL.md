---
name: citation-origin-chain-verifier
description: Audits bibliographic citations to verify link integrity, DOI persistence, and quote accuracy in referenced literature. Use when validating academic citations and technical documentation references.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.doi.org/the-identifier/what-is-a-doi/"
---
# Citation Origin Chain Verifier

## Overview
Citations frequently suffer from link rot, circular quoting, and misattributed findings. Verifying DOI resolution and locating exact page numbers guarantees reference integrity.

## Operational Workflow

1. **Extract all URLs, DOIs, and formal bibliographic citations from text documents.**:
   - Extract all URLs, DOIs, and formal bibliographic citations from text documents.

2. **Query Crossref API to confirm DOI resolution and fetch canonical publication metadata.**:
   - Query Crossref API to confirm DOI resolution and fetch canonical publication metadata.

3. **Verify HTTP link health (200 OK) and archive vulnerable web links using the Wayback Machine.**:
   - Verify HTTP link health (200 OK) and archive vulnerable web links using the Wayback Machine.

4. **Cross-check cited page numbers and verbatim text against source PDFs to ensure quote fidelity.**:
   - Cross-check cited page numbers and verbatim text against source PDFs to ensure quote fidelity.

## Recommended Tools & Environments
- DOI API
- Crossref API
- URL Health Checking
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
