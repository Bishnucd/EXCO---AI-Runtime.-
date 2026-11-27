---
name: frequency-separation-portrait-retouching
description: Separates fine skin textures from underlying color tones into high and low frequency layers. Use when performing non-destructive, professional skin retouching and blemish removal.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Frequency_separation"
---
# Frequency Separation Portrait Retouching

## Overview
Traditional blurring destroys natural skin pores. Frequency separation splits images into a Low Frequency layer (color/tone) and a High Frequency layer (pores/wrinkles), allowing independent editing.

## Operational Workflow

1. **Create Low Frequency layer by applying Gaussian blur (radius 8–12px) to original portrait.**:
   - Create Low Frequency layer by applying Gaussian blur (radius 8–12px) to original portrait.

2. **Create High Frequency layer by subtracting Low Frequency from original and adding 128 neutral gray offset.**:
   - Create High Frequency layer by subtracting Low Frequency from original and adding 128 neutral gray offset.

3. **Smooth color blotches and redness by brushing only the Low Frequency color layer.**:
   - Smooth color blotches and redness by brushing only the Low Frequency color layer.

4. **Remove temporary blemishes on the High Frequency layer while preserving authentic skin pore texture.**:
   - Remove temporary blemishes on the High Frequency layer while preserving authentic skin pore texture.

## Recommended Tools & Environments
- Frequency Separation
- High/Low Frequency Split
- OpenCV / Photoshop Scripting
- Portrait Retouching

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
