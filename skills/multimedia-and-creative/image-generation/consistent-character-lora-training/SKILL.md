---
name: consistent-character-lora-training
description: Trains specialized LoRA adapters on curated character portraits to maintain facial and identity consistency. Use when generating recurrent characters across multi-scene visual narratives.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/kohya-ss/sd-scripts"
---
# Consistent Character Lora Training

## Overview
Generic diffusion models generate different faces on every seed. Training a lightweight LoRA (100MB) on 15-25 diverse character photos locks in facial structure, hairstyle, and identity.

## Operational Workflow

1. **Curate 20 high-resolution character photos spanning diverse angles, expressions, and lighting.**:
   - Curate 20 high-resolution character photos spanning diverse angles, expressions, and lighting.

2. **Tag images with unique trigger tokens (e.g. ohwx character) and descriptive attribute labels.**:
   - Tag images with unique trigger tokens (e.g. ohwx character) and descriptive attribute labels.

3. **Train LoRA weights using Kohya-ss with optimized learning rates (1e-4) and AdamWW optimizer.**:
   - Train LoRA weights using Kohya-ss with optimized learning rates (1e-4) and AdamWW optimizer.

4. **Validate checkpoint consistency across diverse test prompts and wardrobe environments.**:
   - Validate checkpoint consistency across diverse test prompts and wardrobe environments.

## Recommended Tools & Environments
- Kohya-ss
- LoRA
- SDXL
- PyTorch

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
