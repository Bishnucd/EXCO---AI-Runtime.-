---
name: video-speed-ramp-motion-interpolation
description: Applies smooth video speed ramps and motion-compensated frame interpolation using FFmpeg minterpolate. Use when creating cinematic slow-motion effects from standard frame-rate footage.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#minterpolate"
---
# Video Speed Ramp Motion Interpolation

## Overview
Slowing down 30fps footage to 25% speed results in choppy 7.5fps stuttering. Motion-compensated frame interpolation synthesizes intermediate frames, producing butter-smooth slow motion.

## Operational Workflow

1. **Define speed transition curve keyframes (e.g. 100% -> 25% -> 100%).**:
   - Define speed transition curve keyframes (e.g. 100% -> 25% -> 100%).

2. **Apply setpts filter to dynamically stretch frame presentation timestamps.**:
   - Apply setpts filter to dynamically stretch frame presentation timestamps.

3. **Execute minterpolate filter with motion estimation (mci) to synthesize missing in-between frames.**:
   - Execute minterpolate filter with motion estimation (mci) to synthesize missing in-between frames.

4. **Adjust accompanying audio track pitch and speed using atempo filters to maintain synchronization.**:
   - Adjust accompanying audio track pitch and speed using atempo filters to maintain synchronization.

## Recommended Tools & Environments
- FFmpeg
- Motion Vector Interpolation
- Video Editing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
