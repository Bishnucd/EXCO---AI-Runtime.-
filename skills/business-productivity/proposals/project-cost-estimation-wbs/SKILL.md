---
name: project-cost-estimation-wbs
description: Calculates bottom-up software project cost estimates using Work Breakdown Structures (WBS) and three-point estimation. Use when scoping engineering budgets and client commercial quotes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.pmi.org/pmbok-guide-standards"
---
# Project Cost Estimation Wbs

## Overview
Accurate project estimation balances optimism and risk. Decomposing deliverables into a granular Work Breakdown Structure (WBS) and applying PERT three-point estimates prevents budget overruns.

## Operational Workflow

1. **Decompose project scope into granular, deliverable-oriented tasks (< 40 hours each).**:
   - Decompose project scope into granular, deliverable-oriented tasks (< 40 hours each).

2. **Collect optimistic ($O$), most likely ($M$), and pessimistic ($P$) estimates for each task.**:
   - Collect optimistic ($O$), most likely ($M$), and pessimistic ($P$) estimates for each task.

3. **Compute expected duration using the PERT formula**:
   - Compute expected duration using the PERT formula: $E = (O + 4M + P) / 6$.

4. **Apply blended developer hourly rates, risk buffers, and licensing costs to produce final cost models.**:
   - Apply blended developer hourly rates, risk buffers, and licensing costs to produce final cost models.

## Recommended Tools & Environments
- Spreadsheets / CSV
- PERT Estimation
- Markdown
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
