---
name: aspect-ratio-outpainting-canvas-expansion
description: Expands image canvas boundaries into widescreen or panoramic aspect ratios using inpainting models. Use when adapting square photos for horizontal banners or vertical video formats.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://huggingface.co/docs/diffusers/using-diffusers/inpaint"
---
# Aspect Ratio Outpainting Canvas Expansion

## Overview
Outpainting pads the edges of an existing image with transparent canvas, running an inpainting diffusion model over the padded area to hallucinate seamless environmental extensions.

## Operational Workflow

1. **Expand original image canvas to target aspect ratio (e.g., from 1**:
   - Expand original image canvas to target aspect ratio (e.g., from 1:1 to 16:9) with transparent borders.

2. **Generate binary inpainting mask marking original content as protected and padded borders as inpainting zones.**:
   - Generate binary inpainting mask marking original content as protected and padded borders as inpainting zones.

3. **Feather mask boundary edge by 16 pixels to ensure smooth color and texture blending.**:
   - Feather mask boundary edge by 16 pixels to ensure smooth color and texture blending.

4. **Execute inpainting pipeline with prompt describing surrounding landscape context.**:
   - Execute inpainting pipeline with prompt describing surrounding landscape context.

## Recommended Tools & Environments
- Outpainting
- Inpainting Pipeline
- Canvas Expansion
- Diffusers

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
