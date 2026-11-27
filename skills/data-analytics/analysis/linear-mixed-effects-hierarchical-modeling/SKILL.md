---
name: linear-mixed-effects-hierarchical-modeling
description: Fits Linear Mixed-Effects Models (LMM) with fixed and random effects for nested, hierarchical data using statsmodels. Use when analyzing clustered or repeated-measures experimental data.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.statsmodels.org/stable/mixed_linear.html"
---
# Linear Mixed Effects Hierarchical Modeling

## Overview
Standard linear regression assumes independent observations. Mixed-effects models account for hierarchical clustering (e.g. students nested within schools, repeated tests on the same patient).

## Operational Workflow

1. **Structure longitudinal or clustered dataset with explicit grouping indicator variables.**:
   - Structure longitudinal or clustered dataset with explicit grouping indicator variables.

2. **Define fixed effects (experimental treatments) and random effects (random intercepts/slopes per group).**:
   - Define fixed effects (experimental treatments) and random effects (random intercepts/slopes per group).

3. **Fit model using restricted maximum likelihood (REML) via statsmodels MixedLM.**:
   - Fit model using restricted maximum likelihood (REML) via statsmodels MixedLM.

4. **Inspect fixed-effect coefficients, confidence intervals, and intra-class correlation coefficients (ICC).**:
   - Inspect fixed-effect coefficients, confidence intervals, and intra-class correlation coefficients (ICC).

## Recommended Tools & Environments
- statsmodels
- Python 3.10+
- Pandas
- Biostatistics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
