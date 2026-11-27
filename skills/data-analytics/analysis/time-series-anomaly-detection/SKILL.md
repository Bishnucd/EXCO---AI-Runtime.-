---
name: time-series-anomaly-detection
description: Detects unexpected spikes, drops, and trend shifts in time-series metric streams using rolling statistics and isolation forests. Use when monitoring system health or financial metrics for irregularities.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://otexts.com/fpp3/decomposition.html"
---
# Time Series Anomaly Detection

## Overview
Operational metrics exhibit seasonality and trends that fool naive threshold alerts. Time-series decomposition isolates seasonal components to detect genuine structural anomalies.

## Operational Workflow

1. **Decompose time series into trend, seasonal, and residual components using STL decomposition.**:
   - Decompose time series into trend, seasonal, and residual components using STL decomposition.

2. **Compute dynamic rolling mean and standard deviation bands (Bollinger bands) on residuals.**:
   - Compute dynamic rolling mean and standard deviation bands (Bollinger bands) on residuals.

3. **Train Isolation Forest or DBSCAN models to identify multi-dimensional metric anomalies.**:
   - Train Isolation Forest or DBSCAN models to identify multi-dimensional metric anomalies.

4. **Emit structured alert payloads with severity rankings and historical context baselines.**:
   - Emit structured alert payloads with severity rankings and historical context baselines.

## Recommended Tools & Environments
- Python 3.10+
- Statsmodels
- Scikit-Learn
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
