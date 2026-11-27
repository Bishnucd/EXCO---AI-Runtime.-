---
name: video-stabilization-vidstab-shaky-footage
description: Stabilizes shaky handheld camera footage in two passes using FFmpeg vidstabdetect and vidstabtransform. Use when smoothing jittery smartphone and action camera videos.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/georgmartius/vid.stab"
---
# Video Stabilization Vidstab Shaky Footage

## Overview
Handheld camera shake ruins production value. vid.stab analyzes camera translation, rotation, and zoom motion vectors in pass 1, smoothing camera trajectories in pass 2 with dynamic cropping.

## Operational Workflow

1. **Pass 1**:
   - Pass 1: Run vidstabdetect to calculate camera transformations and write transforms.trf file.

2. **Pass 2**:
   - Pass 2: Run vidstabtransform specifying smoothing radius (e.g., smoothing=30) and zoom crop (e.g., zoom=3).

3. **Configure unsharp masking filter to counteract slight softening caused by bilinear transform resampling.**:
   - Configure unsharp masking filter to counteract slight softening caused by bilinear transform resampling.

4. **Review side-by-side comparison to verify that camera shake is smoothed while avoiding extreme zoom-in.**:
   - Review side-by-side comparison to verify that camera shake is smoothed while avoiding extreme zoom-in.

## Recommended Tools & Environments
- vid.stab
- FFmpeg Filters
- Video Stabilization
- Camera Motion

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
