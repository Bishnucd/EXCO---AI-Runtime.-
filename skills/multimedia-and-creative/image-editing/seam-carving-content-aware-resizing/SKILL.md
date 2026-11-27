---
name: seam-carving-content-aware-resizing
description: Resizes images non-linearly while protecting key subject features using seam carving and energy gradient maps. Use when reframing wide landscape photography for vertical displays.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Seam_carving"
---
# Seam Carving Content Aware Resizing

## Overview
Standard cropping loses scene context and stretching distorts subjects. Seam carving finds connected paths of lowest energy (least detail) and removes them iteratively to resize images.

## Operational Workflow

1. **Compute energy gradient map of the image using dual-gradient or Sobel magnitude operators.**:
   - Compute energy gradient map of the image using dual-gradient or Sobel magnitude operators.

2. **Use dynamic programming to find the vertical or horizontal seam path with the minimum cumulative energy.**:
   - Use dynamic programming to find the vertical or horizontal seam path with the minimum cumulative energy.

3. **Remove the optimal seam from the image matrix, reducing image width or height by 1 pixel.**:
   - Remove the optimal seam from the image matrix, reducing image width or height by 1 pixel.

4. **Iterate seam removal until target aspect ratio is reached, leaving important foreground subjects untouched.**:
   - Iterate seam removal until target aspect ratio is reached, leaving important foreground subjects untouched.

## Recommended Tools & Environments
- Seam Carving
- Content-Aware Scaling
- Dynamic Programming
- NumPy / OpenCV

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
