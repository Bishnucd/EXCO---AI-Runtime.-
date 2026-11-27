---
name: auto-subtitles-burned-in-ass-styling
description: Compiles transcribed subtitle files into styled Advanced SubStation Alpha (.ass) scripts and burns them into video. Use when creating hardcoded social media video captions with custom fonts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "http://www.tcax.org/docs/ass-specs.htm"
---
# Auto Subtitles Burned In Ass Styling

## Overview
Social video feeds mute audio by default. Hardcoding animated, styled captions directly into the video canvas using the ASS format guarantees maximum viewer engagement and retention.

## Operational Workflow

1. **Convert word-level transcription timestamps into ASS format dialogue events.**:
   - Convert word-level transcription timestamps into ASS format dialogue events.

2. **Define ASS style parameters**:
   - Define ASS style parameters: custom display fonts, bold borders, drop shadows, and active word colors.

3. **Execute FFmpeg with -vf subtitles=sub.ass filter to rasterize glyphs directly into the video stream.**:
   - Execute FFmpeg with -vf subtitles=sub.ass filter to rasterize glyphs directly into the video stream.

4. **Render optimized H.264 MP4 suitable for instant TikTok, Reels, or YouTube upload.**:
   - Render optimized H.264 MP4 suitable for instant TikTok, Reels, or YouTube upload.

## Recommended Tools & Environments
- FFmpeg
- ASS Subtitle Format
- Node.js / Python
- Typography

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
