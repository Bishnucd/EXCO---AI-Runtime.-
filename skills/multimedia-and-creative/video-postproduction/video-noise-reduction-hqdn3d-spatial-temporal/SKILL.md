---
name: video-noise-reduction-hqdn3d-spatial-temporal
description: Reduces high-ISO sensor noise and grain from low-light video using 3D spatio-temporal filtering with FFmpeg hqdn3d. Use when cleaning underexposed event and night video captures.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#hqdn3d"
---
# Video Noise Reduction Hqdn3d Spatial Temporal

## Overview
Low-light video exhibits severe dancing chroma and luma noise. hqdn3d averages pixels across both 2D spatial neighbors and consecutive time frames, eliminating grain while keeping moving edges sharp.

## Operational Workflow

1. **Construct FFmpeg command with filter**:
   - Construct FFmpeg command with filter: -vf "hqdn3d=luma_spatial=4.0:chroma_spatial=3.0:luma_tmp=6.0:chroma_tmp=4.5".

2. **Tune temporal parameters carefully to prevent ghosting or motion blur on fast-moving objects.**:
   - Tune temporal parameters carefully to prevent ghosting or motion blur on fast-moving objects.

3. **Increase chroma spatial smoothing to aggressively eradicate purple and green digital sensor noise.**:
   - Increase chroma spatial smoothing to aggressively eradicate purple and green digital sensor noise.

4. **Verify noise reduction cleans flat dark backgrounds while facial features and text remain crisp.**:
   - Verify noise reduction cleans flat dark backgrounds while facial features and text remain crisp.

## Recommended Tools & Environments
- hqdn3d Filter
- Spatio-Temporal Denoising
- FFmpeg
- Low-Light Video

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
