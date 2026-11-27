---
name: retraction-watch-database-integrity-check
description: Screens scientific literature citations against the Retraction Watch database to avoid citing discredited research. Use when verifying the validity of scientific and medical claims.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://retractionwatch.com/retraction-watch-database-user-guide/"
---
# Retraction Watch Database Integrity Check

## Overview
Retracted scientific papers continue to be cited hundreds of times by unsuspecting researchers. Querying the Retraction Watch database verifies whether cited studies were retracted for fraud or error.

## Operational Workflow

1. **Extract DOIs and titles of all cited scientific references from candidate report or paper.**:
   - Extract DOIs and titles of all cited scientific references from candidate report or paper.

2. **Query Retraction Watch database API or cross-reference against Crossref Retraction notices.**:
   - Query Retraction Watch database API or cross-reference against Crossref Retraction notices.

3. **Flag any references matching active retraction, expression of concern, or significant correction notices.**:
   - Flag any references matching active retraction, expression of concern, or significant correction notices.

4. **Replace retracted citations with valid, peer-reviewed scientific alternatives.**:
   - Replace retracted citations with valid, peer-reviewed scientific alternatives.

## Recommended Tools & Environments
- Retraction Watch Database
- Scientific Integrity
- Academic Audit
- Citation Screening

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
