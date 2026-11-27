---
name: travel-expense-policy-compliance-audit
description: Audits corporate employee expense reports against corporate travel policies and IRS per-diem limits. Use when detecting non-compliant expense submissions and expense report fraud.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.gsa.gov/travel/plan-book/per-diem-rates"
---
# Travel Expense Policy Compliance Audit

## Overview
Manual expense auditing is slow and inconsistent. Automated validation rules check receipts against hotel nightly rate caps, airfare class policies, and meal per-diem limits.

## Operational Workflow

1. **Ingest itemized expense claim records, receipt images, and employee travel locations.**:
   - Ingest itemized expense claim records, receipt images, and employee travel locations.

2. **Compare claimed lodging rates against GSA federal per-diem caps for the destination city.**:
   - Compare claimed lodging rates against GSA federal per-diem caps for the destination city.

3. **Flag non-compliant line items**:
   - Flag non-compliant line items: alcohol, premium economy upgrades, or duplicate receipts.

4. **Route compliant reports for automated reimbursement and flag exceptions for manager review.**:
   - Route compliant reports for automated reimbursement and flag exceptions for manager review.

## Recommended Tools & Environments
- GSA Per Diem Rates
- Expense Auditing
- Python / Spreadsheets
- Rules Engine

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
