---
name: court-docket-pacer-legal-record-verification
description: Retrieves and verifies federal court filings, dockets, and judicial orders directly from PACER and CourtListener. Use when confirming litigation status, settlements, and civil rulings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.courtlistener.com/api/"
---
# Court Docket Pacer Legal Record Verification

## Overview
Journalistic accounts of lawsuits frequently misstate legal rulings. Querying PACER and CourtListener APIs retrieves the original filed complaint, docket entries, and official judicial opinions.

## Operational Workflow

1. **Identify court jurisdiction (e.g., U.S. District Court for the Southern District of New York) and case docket number.**:
   - Identify court jurisdiction (e.g., U.S. District Court for the Southern District of New York) and case docket number.

2. **Query CourtListener API to fetch full docket history and docket entry document attachments.**:
   - Query CourtListener API to fetch full docket history and docket entry document attachments.

3. **Inspect filed legal complaint to verify actual plaintiff claims vs public PR exaggerations.**:
   - Inspect filed legal complaint to verify actual plaintiff claims vs public PR exaggerations.

4. **Review judge memorandum opinion and final judgment order to determine precise legal ruling.**:
   - Review judge memorandum opinion and final judgment order to determine precise legal ruling.

## Recommended Tools & Environments
- CourtListener API
- PACER
- Federal Court Dockets
- Legal Verification

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
