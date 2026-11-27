---
name: green-screen-chroma-key-color-spill-suppression
description: Extracts green screen foreground actors and suppresses green edge color spill using FFmpeg colorkey and despill. Use when compositing actors onto virtual studio backgrounds.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#colorkey"
---
# Green Screen Chroma Key Color Spill Suppression

## Overview
Chroma keying removes bright green backdrop colors. Green bounce light ("spill") often coats actor shoulders and hair. Applying despill filters neutralizes green edges into natural skin tones.

## Operational Workflow

1. **Identify exact green backdrop hex color (e.g., #00FF00) from sample frame.**:
   - Identify exact green backdrop hex color (e.g., #00FF00) from sample frame.

2. **Apply colorkey filter with similarity (0.3) and blend (0.1) thresholds to extract alpha matte.**:
   - Apply colorkey filter with similarity (0.3) and blend (0.1) thresholds to extract alpha matte.

3. **Chain despill=green**:
   - Chain despill=green:type=lum filter to desaturate residual green reflection on actor edges.

4. **Composite keyed foreground over target virtual background image or motion graphic video.**:
   - Composite keyed foreground over target virtual background image or motion graphic video.

## Recommended Tools & Environments
- Chroma Key
- Despill Filter
- FFmpeg Compositing
- VFX

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
