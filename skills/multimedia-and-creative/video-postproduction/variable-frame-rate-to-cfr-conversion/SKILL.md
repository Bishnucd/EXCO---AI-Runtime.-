---
name: variable-frame-rate-to-cfr-conversion
description: Transcodes smartphone and screen-recorded Variable Frame Rate (VFR) video into Constant Frame Rate (CFR). Use when eliminating audio desync in professional NLEs like Premiere and DaVinci.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://trac.ffmpeg.org/wiki/StreamingGuide#ConstantFrameRate"
---
# Variable Frame Rate To Cfr Conversion

## Overview
Smartphones record in VFR to save battery, dropping framerates when scenes are static. Non-linear editors (Premiere, DaVinci) expect CFR, causing severe audio desync if imported directly.

## Operational Workflow

1. **Inspect video stream metadata with ffprobe to detect variable frame rate flags.**:
   - Inspect video stream metadata with ffprobe to detect variable frame rate flags.

2. **Execute CFR transcode**:
   - Execute CFR transcode: ffmpeg -i vfr_phone.mp4 -vsync cfr -r 30 -c:v libx264 -crf 18 -c:a copy cfr_edit.mp4.

3. **Pad or duplicate frames deterministically to maintain strict 30.000 or 60.000 FPS cadence.**:
   - Pad or duplicate frames deterministically to maintain strict 30.000 or 60.000 FPS cadence.

4. **Confirm with ffprobe that r_frame_rate matches avg_frame_rate exactly.**:
   - Confirm with ffprobe that r_frame_rate matches avg_frame_rate exactly.

## Recommended Tools & Environments
- Constant Frame Rate (CFR)
- FFmpeg -r / -vsync
- Video Transcoding
- NLE Prep

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
