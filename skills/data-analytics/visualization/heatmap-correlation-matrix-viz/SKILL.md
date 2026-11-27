---
name: heatmap-correlation-matrix-viz
description: Renders statistical correlation heatmaps with diverging color scales and hierarchical clustering dendrograms. Use when analyzing multivariate feature correlation in datasets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://seaborn.pydata.org/generated/seaborn.heatmap.html"
---
# Heatmap Correlation Matrix Viz

## Overview
Multivariate exploratory data analysis requires spotting collinearity across dozens of variables. Correlation heatmaps visualize Pearson/Spearman coefficients with diverging color gradients.

## Operational Workflow

1. **Compute symmetric pairwise correlation matrix across numerical DataFrame columns.**:
   - Compute symmetric pairwise correlation matrix across numerical DataFrame columns.

2. **Apply hierarchical clustering to reorder variables by correlation similarity.**:
   - Apply hierarchical clustering to reorder variables by correlation similarity.

3. **Render heatmap with diverging colormap centered at zero (-1 blue, 0 white, +1 red).**:
   - Render heatmap with diverging colormap centered at zero (-1 blue, 0 white, +1 red).

4. **Annotate cells with numeric correlation values and mask redundant upper triangle.**:
   - Annotate cells with numeric correlation values and mask redundant upper triangle.

## Recommended Tools & Environments
- Python / Seaborn / Matplotlib
- Plotly
- Pandas
- NumPy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
