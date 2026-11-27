---
name: video-watermark-overlay-transparency-positioning
description: Overlays alpha-transparent branded logo watermarks with pixel-exact coordinate offsets using FFmpeg overlay. Use when protecting proprietary video assets and branding broadcast footage.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#overlay-1"
---
# Video Watermark Overlay Transparency Positioning

## Overview
Watermarking requires compositing transparent PNG logos onto moving video streams with precise anchor positioning (e.g., bottom-right corner with 20px padding) without dropping frame rates.

## Operational Workflow

1. **Prepare 32-bit RGBA PNG logo file with anti-aliased transparency.**:
   - Prepare 32-bit RGBA PNG logo file with anti-aliased transparency.

2. **Construct FFmpeg command with complex filtergraph**:
   - Construct FFmpeg command with complex filtergraph: [0:v][1:v]overlay=W-w-20:H-h-20.

3. **Optional**:
   - Optional: animate watermark fade-in and fade-out using enable=between(t,start,end) expressions.

4. **Render watermarked output video preserving original audio stream with -c**:
   - Render watermarked output video preserving original audio stream with -c:a copy.

## Recommended Tools & Environments
- FFmpeg overlay
- Alpha Transparency
- Video Watermarking
- Branding

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
