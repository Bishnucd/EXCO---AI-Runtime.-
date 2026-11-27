---
name: watermark-overlay-batch-stamping
description: Applies semi-transparent vector and text watermark overlays to image collections with configurable opacity. Use when protecting copyright and branding intellectual property on digital imagery.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pillow.readthedocs.io/en/stable/reference/ImageDraw.html"
---
# Watermark Overlay Batch Stamping

## Overview
Protecting digital image assets requires applying non-intrusive yet tamper-evident watermarks. Layering PNG alpha channels over designated image coordinates ensures consistent branding.

## Operational Workflow

1. **Load base image and vector/PNG watermark graphic asset.**:
   - Load base image and vector/PNG watermark graphic asset.

2. **Calculate dynamic watermark scaling proportional to base image dimensions (e.g. 15% width).**:
   - Calculate dynamic watermark scaling proportional to base image dimensions (e.g. 15% width).

3. **Position watermark relative to selected anchor corner (bottom-right, center) with margin offset.**:
   - Position watermark relative to selected anchor corner (bottom-right, center) with margin offset.

4. **Blend watermark onto base image using alpha compositing at specified opacity (e.g. 35%).**:
   - Blend watermark onto base image using alpha compositing at specified opacity (e.g. 35%).

## Recommended Tools & Environments
- Python 3.10+
- Pillow
- OpenCV
- PNG Alpha

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
