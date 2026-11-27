---
name: synthetic-control-method-policy-evaluation
description: Constructs synthetic control counterfactuals from weighted combinations of unaffected donor units using PySynth. Use when evaluating regional policy interventions or marketing campaigns.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://economics.mit.edu/people/faculty/alberto-abadie/synthetic-control-methods"
---
# Synthetic Control Method Policy Evaluation

## Overview
When a policy or campaign rolls out in one region (e.g. California), you cannot run an A/B test. Synthetic control constructs a weighted counterfactual "synthetic California" from other states to measure impact.

## Operational Workflow

1. **Collect panel data across treated unit and a pool of untreated donor units over pre- and post-intervention periods.**:
   - Collect panel data across treated unit and a pool of untreated donor units over pre- and post-intervention periods.

2. **Fit constrained optimization algorithm to compute weights for donor units that match pre-treatment trajectory.**:
   - Fit constrained optimization algorithm to compute weights for donor units that match pre-treatment trajectory.

3. **Simulate counterfactual post-intervention trajectory using the weighted synthetic control unit.**:
   - Simulate counterfactual post-intervention trajectory using the weighted synthetic control unit.

4. **Calculate treatment effect as difference between actual treated unit outcomes and synthetic control values.**:
   - Calculate treatment effect as difference between actual treated unit outcomes and synthetic control values.

## Recommended Tools & Environments
- Synthetic Control Method
- Econometrics
- Python / R
- Optimization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
