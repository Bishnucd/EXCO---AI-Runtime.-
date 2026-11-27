---
name: stable-diffusion-lora-checkpoint-merging
description: Merges Low-Rank Adaptation (LoRA) weights directly into base Stable Diffusion model checkpoints using weighted arithmetic or DARE. Use when baking styles into models for faster inference.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/huggingface/diffusers/blob/main/docs/source/en/using-diffusers/merge_loras.md"
---
# Stable Diffusion Lora Checkpoint Merging

## Overview
Loading multiple LoRAs at runtime adds inference latency. Merging LoRA delta weights directly into the base model UNet/transformer layers bakes character and style concepts permanently.

## Operational Workflow

1. **Load base diffusion pipeline model weights into memory.**:
   - Load base diffusion pipeline model weights into memory.

2. **Calculate weighted sum of LoRA key/value projection matrices**:
   - Calculate weighted sum of LoRA key/value projection matrices: W_new = W_base + alpha * (A @ B).

3. **Apply DARE (Drop And REscale) or Ties-merging to resolve conflicting parameter weights.**:
   - Apply DARE (Drop And REscale) or Ties-merging to resolve conflicting parameter weights.

4. **Export fused checkpoint as standalone SafeTensors model file for zero-overhead inference.**:
   - Export fused checkpoint as standalone SafeTensors model file for zero-overhead inference.

## Recommended Tools & Environments
- Diffusers
- LoRA Merging
- DARE / Ties-Merging
- PyTorch

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
