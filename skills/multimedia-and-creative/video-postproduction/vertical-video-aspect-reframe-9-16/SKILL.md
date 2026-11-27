---
name: vertical-video-aspect-reframe-9-16
description: Reframes horizontal 16:9 landscape video footage into 9:16 vertical video using dynamic pan-and-scan and background blur. Use when repurposing horizontal video for mobile vertical platforms.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#crop"
---
# Vertical Video Aspect Reframe 9 16

## Overview
Repurposing landscape video for smartphones requires smart framing. Either pan-and-scan tracks the primary subject, or the 16:9 clip is centered over a scaled, blurred background canvas.

## Operational Workflow

1. **Scale source video to fill 9**:
   - Scale source video to fill 9:16 vertical canvas and apply heavy Gaussian blur filter to background layer.

2. **Scale original uncropped 16**:
   - Scale original uncropped 16:9 video layer to fit width (1080px) and center vertically.

3. **Composite foreground crisp layer over blurred ambient background layer using FFmpeg filter_complex.**:
   - Composite foreground crisp layer over blurred ambient background layer using FFmpeg filter_complex.

4. **Encode final vertical 1080x1920 MP4 file with optimized mobile bitrate targets.**:
   - Encode final vertical 1080x1920 MP4 file with optimized mobile bitrate targets.

## Recommended Tools & Environments
- FFmpeg
- OpenCV
- Bash / Python
- Aspect Ratios

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
