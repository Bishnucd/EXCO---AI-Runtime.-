---
name: color-grading-3d-cube-lut-application
description: Applies cinematic 3D .cube color lookup tables (LUTs) to flat Log video footage using FFmpeg lut3d. Use when automating color correction and brand grading in video rendering pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#lut3d"
---
# Color Grading 3d Cube Lut Application

## Overview
Flat camera profiles (Sony S-Log, Canon C-Log) require color grading before publishing. 3D LUTs map input RGB coordinates through 3D cubic interpolation lattices for cinematic color tones.

## Operational Workflow

1. **Obtain calibrated 33x33x33 or 65x65x65 .cube 3D LUT file matching source camera log profile.**:
   - Obtain calibrated 33x33x33 or 65x65x65 .cube 3D LUT file matching source camera log profile.

2. **Construct FFmpeg filtergraph**:
   - Construct FFmpeg filtergraph: -vf "lut3d=file=cinematic_warm.cube:interp=tetrahedral".

3. **Select tetrahedral interpolation algorithm to ensure smooth color gradients without posterization.**:
   - Select tetrahedral interpolation algorithm to ensure smooth color gradients without posterization.

4. **Inspect video scopes (waveform and vectorscope) to verify broadcast legal video levels.**:
   - Inspect video scopes (waveform and vectorscope) to verify broadcast legal video levels.

## Recommended Tools & Environments
- 3D LUT (.cube)
- FFmpeg lut3d Filter
- Color Grading
- Log Footage

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
