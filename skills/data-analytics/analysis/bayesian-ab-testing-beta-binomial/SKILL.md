---
name: bayesian-ab-testing-beta-binomial
description: Evaluates A/B test conversion rates using Bayesian Beta-Binomial conjugate models and probability of being best. Use when making rapid experimentation decisions without p-value misconceptions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pymc.io/"
---
# Bayesian Ab Testing Beta Binomial

## Overview
Frequentist p-values cannot answer "What is the probability Variation B is better than Variation A?". Bayesian updating models posterior Beta distributions directly, computing expected loss and probability to win.

## Operational Workflow

1. **Define prior Beta distributions representing historical conversion rates (e.g. Beta(10, 90)).**:
   - Define prior Beta distributions representing historical conversion rates (e.g. Beta(10, 90)).

2. **Update posterior distributions with observed trial counts and conversions (Beta(alpha + wins, beta + losses)).**:
   - Update posterior distributions with observed trial counts and conversions (Beta(alpha + wins, beta + losses)).

3. **Sample posterior distributions to calculate P(B > A) and expected percentage uplift.**:
   - Sample posterior distributions to calculate P(B > A) and expected percentage uplift.

4. **Evaluate stopping criteria**:
   - Evaluate stopping criteria: declare winner when P(B > A) > 95% and expected loss falls below risk threshold.

## Recommended Tools & Environments
- PyMC / SciPy
- Bayesian Statistics
- Beta-Binomial
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
