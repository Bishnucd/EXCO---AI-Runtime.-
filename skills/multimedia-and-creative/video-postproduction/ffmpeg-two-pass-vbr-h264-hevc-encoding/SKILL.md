---
name: ffmpeg-two-pass-vbr-h264-hevc-encoding
description: Encodes video files using two-pass constrained variable bitrate (VBR) H.264/HEVC encoding with FFmpeg. Use when maximizing video compression efficiency for fixed file size budgets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://trac.ffmpeg.org/wiki/Encode/H.264#twopass"
---
# Ffmpeg Two Pass Vbr H264 Hevc Encoding

## Overview
Single-pass encoding wastes bits on simple static scenes and starves complex motion scenes. Two-pass encoding analyzes scene complexity across the entire video in pass 1, allocating bits optimally in pass 2.

## Operational Workflow

1. **Execute pass 1 command outputting analysis log file**:
   - Execute pass 1 command outputting analysis log file: ffmpeg -y -i in.mp4 -c:v libx264 -b:v 2500k -pass 1 -an -f null /dev/null.

2. **Execute pass 2 command utilizing analysis log**:
   - Execute pass 2 command utilizing analysis log: ffmpeg -i in.mp4 -c:v libx264 -b:v 2500k -pass 2 -c:a aac -b:a 128k out.mp4.

3. **Verify video stream visual fidelity across high-motion segments using VMAF metrics.**:
   - Verify video stream visual fidelity across high-motion segments using VMAF metrics.

4. **Confirm output file size strictly adheres to target distribution bandwidth limits.**:
   - Confirm output file size strictly adheres to target distribution bandwidth limits.

## Recommended Tools & Environments
- FFmpeg
- Two-Pass VBR
- libx264 / libx265
- Video Compression

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
