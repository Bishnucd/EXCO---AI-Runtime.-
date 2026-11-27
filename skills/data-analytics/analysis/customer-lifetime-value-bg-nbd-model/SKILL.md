---
name: customer-lifetime-value-bg-nbd-model
description: Estimates Customer Lifetime Value (CLV) and future purchase frequency using Beta-Geometric/Negative Binomial (BG/NBD) models. Use when forecasting customer revenue and retention cohorts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://lifetimes.readthedocs.io/en/latest/"
---
# Customer Lifetime Value Bg Nbd Model

## Overview
Predicting customer value requires modeling transaction recency and frequency. BG/NBD models calculate probability of customer alive status and forecast expected transactions over upcoming months.

## Operational Workflow

1. **Prepare summary dataset aggregating Recency (t_x), Frequency (x), and customer tenure (T).**:
   - Prepare summary dataset aggregating Recency (t_x), Frequency (x), and customer tenure (T).

2. **Fit BetaGeoFitter model using maximum likelihood estimation on historical transaction data.**:
   - Fit BetaGeoFitter model using maximum likelihood estimation on historical transaction data.

3. **Predict expected transaction frequency for each customer over the next 12 months.**:
   - Predict expected transaction frequency for each customer over the next 12 months.

4. **Combine with Gamma-Gamma submodel to predict future monetary value and total expected CLV.**:
   - Combine with Gamma-Gamma submodel to predict future monetary value and total expected CLV.

## Recommended Tools & Environments
- lifetimes / PyMC
- Python 3.10+
- Pandas
- Predictive Analytics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
