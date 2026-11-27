---
name: causal-inference-propensity-score-matching
description: Estimates Average Treatment Effects (ATE) from observational data using Propensity Score Matching (PSM) and DoWhy. Use when measuring feature impact without running randomized A/B tests.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/py-why/dowhy"
---
# Causal Inference Propensity Score Matching

## Overview
Observational data suffers from selection bias (users who enable a feature are already more engaged). Propensity score matching pairs treated users with identical untreated controls to isolate true causal lift.

## Operational Workflow

1. **Model propensity scores**:
   - Model propensity scores: train logistic regression predicting probability of user receiving treatment.

2. **Execute nearest-neighbor matching pairing each treated user with an untreated user with identical propensity.**:
   - Execute nearest-neighbor matching pairing each treated user with an untreated user with identical propensity.

3. **Verify covariate balance across matched treatment and control groups.**:
   - Verify covariate balance across matched treatment and control groups.

4. **Calculate Average Treatment Effect on the Treated (ATT) with refutation sensitivity checks.**:
   - Calculate Average Treatment Effect on the Treated (ATT) with refutation sensitivity checks.

## Recommended Tools & Environments
- DoWhy / CausalML
- Python 3.10+
- Propensity Score Matching
- Econometrics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
