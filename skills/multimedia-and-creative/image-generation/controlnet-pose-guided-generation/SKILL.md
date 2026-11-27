---
name: controlnet-pose-guided-generation
description: Directs diffusion image generation using ControlNet OpenPose and depth map condition conditioning. Use when requiring precise human postures and compositions in generated art.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/lllyasviel/ControlNet"
---
# Controlnet Pose Guided Generation

## Overview
Prompting alone cannot guarantee specific human poses or exact object positioning. ControlNet adds spatial structural conditioning (skeleton pose, Canny edges, depth maps) to guide generation.

## Operational Workflow

1. **Extract OpenPose human skeleton keypoints from reference pose photograph.**:
   - Extract OpenPose human skeleton keypoints from reference pose photograph.

2. **Load Stable Diffusion XL pipeline with ControlNet conditioning adapter.**:
   - Load Stable Diffusion XL pipeline with ControlNet conditioning adapter.

3. **Pass text prompt alongside extracted pose tensor to guide the denoising diffusion trajectory.**:
   - Pass text prompt alongside extracted pose tensor to guide the denoising diffusion trajectory.

4. **Generate output imagery adhering frame-perfectly to the reference skeleton posture.**:
   - Generate output imagery adhering frame-perfectly to the reference skeleton posture.

## Recommended Tools & Environments
- ControlNet
- Stable Diffusion XL
- OpenPose
- Python / Diffusers

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
