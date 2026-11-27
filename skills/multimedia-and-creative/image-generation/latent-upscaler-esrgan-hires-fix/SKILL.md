---
name: latent-upscaler-esrgan-hires-fix
description: Upscales generated images to 4K resolution while adding photorealistic micro-details using Real-ESRGAN and latent Hi-Res Fix. Use when eliminating blur and artifacts during high-res generation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/xinntao/Real-ESRGAN"
---
# Latent Upscaler Esrgan Hires Fix

## Overview
Generating directly at high resolutions causes duplicate heads and disjointed bodies. The Hi-Res Fix workflow generates at 512px/1024px, upscales latents, and performs a second denoising pass.

## Operational Workflow

1. **Generate initial image at native model training resolution (e.g., 1024x1024 for SDXL).**:
   - Generate initial image at native model training resolution (e.g., 1024x1024 for SDXL).

2. **Upscale initial image 2x using Real-ESRGAN or bicubic latent space scaling.**:
   - Upscale initial image 2x using Real-ESRGAN or bicubic latent space scaling.

3. **Execute secondary diffusion pass with low denoising strength (0.35–0.45) to refine micro-details.**:
   - Execute secondary diffusion pass with low denoising strength (0.35–0.45) to refine micro-details.

4. **Verify that eye pupils, skin textures, and hair strands are crisply rendered without hallucinations.**:
   - Verify that eye pupils, skin textures, and hair strands are crisply rendered without hallucinations.

## Recommended Tools & Environments
- Real-ESRGAN
- Latent Hi-Res Fix
- Super-Resolution
- Diffusion Upscaling

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
