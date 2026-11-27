---
name: procurement-purchase-order-workflow
description: Structures Purchase Requisition (PR) to Purchase Order (PO) approval matrices and three-way matching. Use when managing corporate procurement spend and accounts payable validation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.cips.org/knowledge/procurement-topics-and-tools/"
---
# Procurement Purchase Order Workflow

## Overview
Unchecked spending drains corporate cash flow. A formal procurement workflow requires purchase requisitions with tiered managerial approvals, formal PO issuance, and three-way matching before invoice payment.

## Operational Workflow

1. **Submit Purchase Requisition detailing vendor, business justification, and GL account code.**:
   - Submit Purchase Requisition detailing vendor, business justification, and GL account code.

2. **Route PR through managerial approval workflow based on expenditure thresholds ($5k, $25k, $100k).**:
   - Route PR through managerial approval workflow based on expenditure thresholds ($5k, $25k, $100k).

3. **Generate binding Purchase Order (PO) and transmit to vendor upon approval.**:
   - Generate binding Purchase Order (PO) and transmit to vendor upon approval.

4. **Perform three-way match**:
   - Perform three-way match: verify that PO, receiving delivery slip, and vendor invoice agree before payment.

## Recommended Tools & Environments
- CIPS Framework
- Three-Way Matching
- Procurement
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
