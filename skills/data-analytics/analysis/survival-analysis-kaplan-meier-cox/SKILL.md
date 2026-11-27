---
name: survival-analysis-kaplan-meier-cox
description: Calculates Kaplan-Meier survival curves and Cox Proportional Hazards regression for time-to-event data. Use when analyzing customer churn velocity, machine failure time, or patient outcomes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://lifelines.readthedocs.io/en/latest/"
---
# Survival Analysis Kaplan Meier Cox

## Overview
Standard regression cannot handle right-censored data (customers who haven't churned yet). Survival analysis models time-to-event curves and estimates hazard ratios across covariate features.

## Operational Workflow

1. **Structure survival dataset with duration time and binary event indicator (observed churn vs censored).**:
   - Structure survival dataset with duration time and binary event indicator (observed churn vs censored).

2. **Fit Kaplan-Meier estimator to visualize probability of survival over days and months.**:
   - Fit Kaplan-Meier estimator to visualize probability of survival over days and months.

3. **Perform Log-Rank tests to compare survival distributions between demographic cohorts.**:
   - Perform Log-Rank tests to compare survival distributions between demographic cohorts.

4. **Fit Cox Proportional Hazards model to compute hazard ratios for behavioral predictive factors.**:
   - Fit Cox Proportional Hazards model to compute hazard ratios for behavioral predictive factors.

## Recommended Tools & Environments
- lifelines
- Python 3.10+
- Survival Analysis
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
