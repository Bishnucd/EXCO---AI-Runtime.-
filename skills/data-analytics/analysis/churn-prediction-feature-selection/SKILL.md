---
name: churn-prediction-feature-selection
description: Engineers behavioral engagement features and selects predictive variables for customer churn modeling. Use when identifying warning signals of impending customer cancellations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://scikit-learn.org/stable/modules/feature_selection.html"
---
# Churn Prediction Feature Selection

## Overview
Predicting churn requires engineering recency, frequency, and monetary (RFM) features and evaluating mutual information scores to isolate high-leverage indicators.

## Operational Workflow

1. **Extract behavioral event counts over 7, 30, and 90-day rolling evaluation windows.**:
   - Extract behavioral event counts over 7, 30, and 90-day rolling evaluation windows.

2. **Compute feature velocity metrics (e.g., ratio of last 7-day logins to previous 30-day average).**:
   - Compute feature velocity metrics (e.g., ratio of last 7-day logins to previous 30-day average).

3. **Calculate mutual information gain and feature importance rankings using tree ensembles.**:
   - Calculate mutual information gain and feature importance rankings using tree ensembles.

4. **Select non-collinear feature subsets for downstream machine learning classifier training.**:
   - Select non-collinear feature subsets for downstream machine learning classifier training.

## Recommended Tools & Environments
- Python 3.10+
- Scikit-Learn
- Pandas
- XGBoost

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
