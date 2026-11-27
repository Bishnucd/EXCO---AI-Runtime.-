---
name: unsharp-mask-high-pass-image-sharpening
description: Enhances micro-contrast and fine edge definition using unsharp masking and high-pass spatial filters. Use when preparing photos for high-resolution print or web display.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Unsharp_masking"
---
# Unsharp Mask High Pass Image Sharpening

## Overview
Unsharp masking creates a blurred inverted copy of an image and subtracts it from the original, creating localized contrast halos along edges that make details appear crisper.

## Operational Workflow

1. **Load image and create Gaussian-blurred duplicate with radius parameter (e.g., radius=1.5).**:
   - Load image and create Gaussian-blurred duplicate with radius parameter (e.g., radius=1.5).

2. **Compute difference map between original and blurred copy to isolate high-frequency edges.**:
   - Compute difference map between original and blurred copy to isolate high-frequency edges.

3. **Add scaled difference back to original image using amount multiplier (e.g., amount=120%).**:
   - Add scaled difference back to original image using amount multiplier (e.g., amount=120%).

4. **Apply threshold limit (e.g., threshold=3) to prevent amplifying subtle flat surface noise.**:
   - Apply threshold limit (e.g., threshold=3) to prevent amplifying subtle flat surface noise.

## Recommended Tools & Environments
- Unsharp Masking
- High-Pass Filter
- Pillow / OpenCV
- Image Sharpening

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
