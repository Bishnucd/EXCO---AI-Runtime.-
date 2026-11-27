---
name: focus-stacking-depth-of-field-fusion
description: Fuses a focus-bracketed series of macro photographs into a single composite image with infinite depth of field. Use when photographing micro-electronics, jewelry, and insects.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Focus_stacking"
---
# Focus Stacking Depth Of Field Fusion

## Overview
Macro lenses have microscopic depth of field, rendering only a fraction of millimeter in focus. Focus stacking captures slices across focal planes and selects the sharpest pixels for each region.

## Operational Workflow

1. **Align image sequence using ECC (Enhanced Correlation Coefficient) image alignment to counter lens breathing.**:
   - Align image sequence using ECC (Enhanced Correlation Coefficient) image alignment to counter lens breathing.

2. **Compute focus measure for every pixel in each frame using Laplacian variance or Tenengrad gradient.**:
   - Compute focus measure for every pixel in each frame using Laplacian variance or Tenengrad gradient.

3. **Generate depth map identifying which frame contains the maximum sharpness for each pixel coordinate.**:
   - Generate depth map identifying which frame contains the maximum sharpness for each pixel coordinate.

4. **Blend frames across multi-resolution splines to generate final all-in-focus composite image.**:
   - Blend frames across multi-resolution splines to generate final all-in-focus composite image.

## Recommended Tools & Environments
- Focus Stacking
- Laplacian Pyramids
- OpenCV
- Macro Photography

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
