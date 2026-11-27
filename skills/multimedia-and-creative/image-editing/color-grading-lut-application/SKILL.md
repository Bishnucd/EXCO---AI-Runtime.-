---
name: color-grading-lut-application
description: Applies 3D Look-Up Tables (.CUBE LUTs) to digital images and video frames to achieve cinematic color grading. Use when enforcing uniform visual aesthetics across creative image assets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pillow.readthedocs.io/en/stable/reference/ImageColor.html"
---
# Color Grading Lut Application

## Overview
Look-Up Tables (LUTs) map input RGB color coordinates to target graded color values. Applying standardized 33x33x33 3D LUTs guarantees uniform color palettes across diverse photo shoots.

## Operational Workflow

1. **Parse .CUBE LUT file to extract 3D color transformation lattice table.**:
   - Parse .CUBE LUT file to extract 3D color transformation lattice table.

2. **Normalize image RGB pixel arrays to unit float representation [0.0, 1.0].**:
   - Normalize image RGB pixel arrays to unit float representation [0.0, 1.0].

3. **Perform trilinear interpolation to look up mapped output colors for every image pixel.**:
   - Perform trilinear interpolation to look up mapped output colors for every image pixel.

4. **Convert graded array back to uint8 pixel buffers and save with color profile preservation.**:
   - Convert graded array back to uint8 pixel buffers and save with color profile preservation.

## Recommended Tools & Environments
- Python 3.10+
- Pillow
- numpy
- 3D LUT (.CUBE)

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
