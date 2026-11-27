---
name: outlier-detection-zscore-iqr-isolation-forest
description: Detects univariate and multivariate data outliers using Z-score, Interquartile Range (IQR), and Isolation Forests. Use when cleaning dirty datasets and catching abnormal telemetry readings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://scikit-learn.org/stable/modules/outlier_detection.html"
---
# Outlier Detection Zscore Iqr Isolation Forest

## Overview
Extreme outliers distort statistical means and machine learning models. Combining robust univariate statistics (IQR filtering) with multivariate Isolation Forests isolates genuinely anomalous observations.

## Operational Workflow

1. **Calculate Interquartile Range (IQR = Q3 - Q1) and flag values falling outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR].**:
   - Calculate Interquartile Range (IQR = Q3 - Q1) and flag values falling outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR].

2. **Compute standardized Z-scores (|Z| > 3) for normally distributed feature columns.**:
   - Compute standardized Z-scores (|Z| > 3) for normally distributed feature columns.

3. **Train Isolation Forest model to detect multivariate outliers that appear normal in individual dimensions.**:
   - Train Isolation Forest model to detect multivariate outliers that appear normal in individual dimensions.

4. **Impute outliers with median values or isolate them into dedicated fraud review tables.**:
   - Impute outliers with median values or isolate them into dedicated fraud review tables.

## Recommended Tools & Environments
- Scikit-Learn
- SciPy
- Pandas
- Outlier Detection

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
