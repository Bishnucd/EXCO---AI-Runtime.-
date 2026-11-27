---
name: statistical-percentage-recalculation-audit
description: Recalculates relative percentage increases vs absolute risk deltas to expose misleading statistical headlines. Use when evaluating clinical medical claims and public policy statistics.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Absolute_risk_reduction"
---
# Statistical Percentage Recalculation Audit

## Overview
Headlines claiming "Drug doubles cancer risk" often hide that risk rose from 1 in 100,000 to 2 in 100,000. Recalculating baseline risk, absolute risk increase, and NNT restores accurate perspective.

## Operational Workflow

1. **Extract raw numerator and denominator sample counts from original research study tables.**:
   - Extract raw numerator and denominator sample counts from original research study tables.

2. **Calculate baseline control event rate (CER) and experimental event rate (EER).**:
   - Calculate baseline control event rate (CER) and experimental event rate (EER).

3. **Compute Absolute Risk Reduction/Increase**:
   - Compute Absolute Risk Reduction/Increase: ARR = |CER - EER|.

4. **Contrast calculated absolute risk with sensationalized Relative Risk (RR) to report balanced mathematical truth.**:
   - Contrast calculated absolute risk with sensationalized Relative Risk (RR) to report balanced mathematical truth.

## Recommended Tools & Environments
- Statistical Audit
- Relative vs Absolute Risk
- Number Needed to Treat (NNT)
- Mathematics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
