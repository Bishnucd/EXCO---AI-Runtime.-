---
name: ab-test-statistical-significance
description: Evaluates A/B test experiment results using two-sample hypothesis tests, p-values, and confidence intervals. Use when determining whether feature variations drive statistically significant metrics.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.evanmiller.org/how-not-to-run-an-ab-test.html"
---
# Ab Test Statistical Significance

## Overview
Making product decisions on raw conversion lift risks false positives. Rigorous hypothesis testing (Z-test, T-test) and confidence intervals ensure observed improvements are statistically sound.

## Operational Workflow

1. **Verify sample size adequacy and minimum detectable effect (MDE) power calculations.**:
   - Verify sample size adequacy and minimum detectable effect (MDE) power calculations.

2. **Perform two-sample Z-test for conversion rates or Welch t-test for continuous metrics (revenue).**:
   - Perform two-sample Z-test for conversion rates or Welch t-test for continuous metrics (revenue).

3. **Compute p-value and evaluate against pre-registered alpha threshold (typically 0.05).**:
   - Compute p-value and evaluate against pre-registered alpha threshold (typically 0.05).

4. **Calculate 95% confidence intervals on absolute and relative lift metrics.**:
   - Calculate 95% confidence intervals on absolute and relative lift metrics.

## Recommended Tools & Environments
- Python 3.10+
- Scipy
- Statsmodels
- NumPy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
