---
name: corporate-registry-opencorporates-verification
description: Verifies company incorporation status, beneficial ownership, and registered directors across OpenCorporates and state registries. Use when performing corporate due diligence and fraud audits.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://api.opencorporates.com/documentation/REST-API-introduction"
---
# Corporate Registry Opencorporates Verification

## Overview
Fraudulent shell companies boast slick websites while lacking legal corporate existence. Querying government company registries verifies official incorporation dates, active standing, and director identities.

## Operational Workflow

1. **Query OpenCorporates API or official jurisdiction registry (e.g., Delaware Division of Corporations, UK Companies House).**:
   - Query OpenCorporates API or official jurisdiction registry (e.g., Delaware Division of Corporations, UK Companies House).

2. **Verify company legal name, corporate registration number, active vs dissolved status, and jurisdiction.**:
   - Verify company legal name, corporate registration number, active vs dissolved status, and jurisdiction.

3. **Inspect historical company name changes and registered agent address filings.**:
   - Inspect historical company name changes and registered agent address filings.

4. **Map registered corporate directors and cross-reference against disqualified director databases.**:
   - Map registered corporate directors and cross-reference against disqualified director databases.

## Recommended Tools & Environments
- OpenCorporates API
- Corporate Registries
- Beneficial Ownership
- Due Diligence

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
