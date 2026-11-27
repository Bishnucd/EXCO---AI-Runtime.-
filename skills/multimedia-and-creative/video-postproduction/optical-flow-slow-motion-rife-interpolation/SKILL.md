---
name: optical-flow-slow-motion-rife-interpolation
description: Generates ultra-smooth slow motion video using RIFE neural optical flow frame interpolation. Use when turning 24fps/30fps camera clips into cinematic 60fps/120fps slow-motion.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/hzwer/Practical-RIFE"
---
# Optical Flow Slow Motion Rife Interpolation

## Overview
Standard frame blending causes ghosting, and frame repeating causes stutter. RIFE calculates bidirectional optical flow vectors to synthesize intermediate frames with pristine clarity.

## Operational Workflow

1. **Extract video frame pairs and feed into RIFE neural network model.**:
   - Extract video frame pairs and feed into RIFE neural network model.

2. **Estimate dense motion vectors between adjacent frames and synthesize intermediate in-between frames.**:
   - Estimate dense motion vectors between adjacent frames and synthesize intermediate in-between frames.

3. **Scale video framerate 2x or 4x (e.g., 30 FPS interpolated to 120 FPS).**:
   - Scale video framerate 2x or 4x (e.g., 30 FPS interpolated to 120 FPS).

4. **Encode slowed video using high-bitrate ProRes or H.264 codec for buttery-smooth playback.**:
   - Encode slowed video using high-bitrate ProRes or H.264 codec for buttery-smooth playback.

## Recommended Tools & Environments
- RIFE
- Optical Flow
- Frame Interpolation
- Slow Motion

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
