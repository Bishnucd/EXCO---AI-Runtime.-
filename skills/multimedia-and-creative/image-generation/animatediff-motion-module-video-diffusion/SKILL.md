---
name: animatediff-motion-module-video-diffusion
description: Injects temporal attention motion modules into text-to-image diffusion models using AnimateDiff. Use when transforming static concept checkpoints into animated looping video clips.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/guoyww/AnimateDiff"
---
# Animatediff Motion Module Video Diffusion

## Overview
AnimateDiff adds temporal self-attention modules across frame sequences, enabling standard 2D Stable Diffusion checkpoints to generate smooth, temporally consistent 16-frame animated videos.

## Operational Workflow

1. **Load base Stable Diffusion checkpoint and inject AnimateDiff motion module weights.**:
   - Load base Stable Diffusion checkpoint and inject AnimateDiff motion module weights.

2. **Configure temporal parameters**:
   - Configure temporal parameters: 16 frames, context window size, and frame rate (8 FPS).

3. **Provide prompt with dynamic motion verbs (e.g., "flowing water", "wind blowing through hair").**:
   - Provide prompt with dynamic motion verbs (e.g., "flowing water", "wind blowing through hair").

4. **Export rendered multi-frame latent sequence to smooth looping MP4 or GIF video.**:
   - Export rendered multi-frame latent sequence to smooth looping MP4 or GIF video.

## Recommended Tools & Environments
- AnimateDiff
- Temporal Attention
- Video Diffusion
- PyTorch

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
