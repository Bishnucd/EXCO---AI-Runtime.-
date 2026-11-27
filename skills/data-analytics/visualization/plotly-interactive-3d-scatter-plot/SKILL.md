---
name: plotly-interactive-3d-scatter-plot
description: Generates hardware-accelerated interactive 3D scatter plots and surface meshes using Plotly. Use when rendering multidimensional datasets with interactive rotation, zoom, and tooltips.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://plotly.com/javascript/3d-scatter-plots/"
---
# Plotly Interactive 3d Scatter Plot

## Overview
Plotly uses WebGL shaders to render responsive 3D point clouds and topographical surface meshes in web browsers with zero client-side lag across millions of coordinate points.

## Operational Workflow

1. **Structure spatial coordinates into X, Y, Z numerical arrays with categorical color vectors.**:
   - Structure spatial coordinates into X, Y, Z numerical arrays with categorical color vectors.

2. **Configure Plotly 3D scatter trace with WebGL acceleration (type**:
   - Configure Plotly 3D scatter trace with WebGL acceleration (type: scatter3d).

3. **Define interactive camera viewpoint angles, aspect ratios, and grid axis tick labels.**:
   - Define interactive camera viewpoint angles, aspect ratios, and grid axis tick labels.

4. **Export interactive HTML bundle or serialize to standalone JSON figure spec.**:
   - Export interactive HTML bundle or serialize to standalone JSON figure spec.

## Recommended Tools & Environments
- Plotly.js
- WebGL
- Python / TypeScript
- Multidimensional Data

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
