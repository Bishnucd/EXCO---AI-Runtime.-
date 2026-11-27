---
name: pillow-adaptive-color-palette-quantization
description: Quantizes 24-bit RGB images into optimal 8-bit indexed color palettes using Pillow octree and median-cut algorithms. Use when generating lightweight PNGs and retro pixel art.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.quantize"
---
# Pillow Adaptive Color Palette Quantization

## Overview
Quantization maps 16 million colors to a compact 256-color palette while applying Floyd-Steinberg dithering to prevent banding, reducing uncompressed image memory footprints by 66%.

## Operational Workflow

1. **Load image using PIL.Image.open and convert to RGB mode.**:
   - Load image using PIL.Image.open and convert to RGB mode.

2. **Execute image.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).**:
   - Execute image.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).

3. **Inspect generated palette color table to ensure dominant brand colors are preserved.**:
   - Inspect generated palette color table to ensure dominant brand colors are preserved.

4. **Save image as optimized 8-bit indexed PNG, cutting file size significantly.**:
   - Save image as optimized 8-bit indexed PNG, cutting file size significantly.

## Recommended Tools & Environments
- Pillow (PIL)
- Color Quantization
- Median-Cut / Octree
- Indexed Color

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
