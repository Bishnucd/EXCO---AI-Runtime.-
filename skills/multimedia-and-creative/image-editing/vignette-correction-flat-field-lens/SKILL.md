---
name: vignette-correction-flat-field-lens
description: Eliminates lens peripheral darkening and vignetting using radial cosine falloff compensation models. Use when flattening uneven lighting across astrophotography and microscope images.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Vignetting"
---
# Vignette Correction Flat Field Lens

## Overview
Camera lenses suffer from natural optical vignetting, where corners receive 30% less light than the center. Multiplying the image by an inverted radial cosine gain mask restores flat lighting.

## Operational Workflow

1. **Calculate normalized distance matrix from image center to all pixel coordinates.**:
   - Calculate normalized distance matrix from image center to all pixel coordinates.

2. **Model lens falloff curve using cosine-fourth law or polynomial radial equation.**:
   - Model lens falloff curve using cosine-fourth law or polynomial radial equation.

3. **Generate inverse gain correction mask normalized to 1.0 at center and >1.0 at corners.**:
   - Generate inverse gain correction mask normalized to 1.0 at center and >1.0 at corners.

4. **Multiply image pixel values by gain mask and clip resulting values to valid [0, 255] range.**:
   - Multiply image pixel values by gain mask and clip resulting values to valid [0, 255] range.

## Recommended Tools & Environments
- Vignette Correction
- Flat-Field Correction
- OpenCV / NumPy
- Lens Correction

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
