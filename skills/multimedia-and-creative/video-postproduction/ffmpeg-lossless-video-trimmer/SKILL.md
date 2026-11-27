---
name: ffmpeg-lossless-video-trimmer
description: Cuts and splices video clips losslessly at exact keyframes without re-encoding via FFmpeg stream copy. Use when trimming video files instantly without quality loss or CPU overhead.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://trac.ffmpeg.org/wiki/Seeking"
---
# Ffmpeg Lossless Video Trimmer

## Overview
Re-encoding long videos consumes immense compute and introduces generational compression artifacts. Stream copy (-c copy) splices video streams directly at keyframe boundaries in milliseconds.

## Operational Workflow

1. **Inspect video keyframe (I-frame) positions using ffprobe.**:
   - Inspect video keyframe (I-frame) positions using ffprobe.

2. **Align cut in-point (-ss) to closest preceding I-frame boundary to avoid frozen frames.**:
   - Align cut in-point (-ss) to closest preceding I-frame boundary to avoid frozen frames.

3. **Execute ffmpeg -ss <start> -to <end> -i <input> -c copy <output> stream splice.**:
   - Execute ffmpeg -ss <start> -to <end> -i <input> -c copy <output> stream splice.

4. **Verify video and audio stream duration alignment and container playback integrity.**:
   - Verify video and audio stream duration alignment and container playback integrity.

## Recommended Tools & Environments
- FFmpeg
- H.264 / H.265
- Bash / PowerShell
- Stream Copy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
