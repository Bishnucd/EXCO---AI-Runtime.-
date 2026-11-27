---
name: altair-declarative-python-grammar
description: Authors declarative statistical visualizations in Python using Altair, compiled directly to Vega-Lite JSON. Use when creating repeatable, publication-ready statistical plots.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://altair-viz.github.io/"
---
# Altair Declarative Python Grammar

## Overview
Altair is a declarative statistical visualization library for Python based on Vega-Lite. It provides a clean, concise syntax that maps dataframe columns directly to visual encoding channels.

## Operational Workflow

1. **Instantiate altair.Chart object passing Pandas or Polars DataFrame.**:
   - Instantiate altair.Chart object passing Pandas or Polars DataFrame.

2. **Specify mark geometry (mark_point, mark_bar, mark_line) with opacity and sizing.**:
   - Specify mark geometry (mark_point, mark_bar, mark_line) with opacity and sizing.

3. **Encode data columns to visual channels (x, y, color, shape, size) with data type indicators.**:
   - Encode data columns to visual channels (x, y, color, shape, size) with data type indicators.

4. **Chain interactive selections (.add_params) to link cross-filtering between multiple subplots.**:
   - Chain interactive selections (.add_params) to link cross-filtering between multiple subplots.

## Recommended Tools & Environments
- Altair
- Vega-Lite
- Python
- Declarative Visualization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
