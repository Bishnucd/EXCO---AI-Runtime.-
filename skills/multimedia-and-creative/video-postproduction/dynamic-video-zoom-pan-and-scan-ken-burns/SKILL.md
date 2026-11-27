---
name: dynamic-video-zoom-pan-and-scan-ken-burns
description: Animates smooth Ken Burns camera zooms, pans, and drifts across high-resolution still photographs using FFmpeg zoompan. Use when producing documentary video sequences from archival photos.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#zoompan"
---
# Dynamic Video Zoom Pan And Scan Ken Burns

## Overview
Static photos feel flat in video productions. The Ken Burns effect applies slow mathematical camera zooms and panning trajectories across high-res photos to create emotional visual movement.

## Operational Workflow

1. **Scale source photograph to high resolution (e.g., 3840x2160) to provide cropping headroom.**:
   - Scale source photograph to high resolution (e.g., 3840x2160) to provide cropping headroom.

2. **Define zoompan expression**:
   - Define zoompan expression: z=min(zoom+0.0015,1.5):d=125:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2).

3. **Set frame rate (fps=30) and duration (d=150 for 5-second animated clip).**:
   - Set frame rate (fps=30) and duration (d=150 for 5-second animated clip).

4. **Chain bicubic interpolation to guarantee smooth sub-pixel panning without stepping stutter.**:
   - Chain bicubic interpolation to guarantee smooth sub-pixel panning without stepping stutter.

## Recommended Tools & Environments
- Ken Burns Effect
- FFmpeg zoompan
- Motion Graphics
- Documentary Editing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
