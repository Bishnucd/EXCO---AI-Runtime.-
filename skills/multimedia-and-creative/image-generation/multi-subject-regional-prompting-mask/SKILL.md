---
name: multi-subject-regional-prompting-mask
description: Directs multiple distinct subjects and styles into separate spatial canvas zones using regional prompting masks. Use when generating complex scenes without prompt attribute bleeding.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/hako-mikan/sd-webui-regional-prompter"
---
# Multi Subject Regional Prompting Mask

## Overview
When prompting "a woman in a red dress next to a man in a blue suit", colors frequently bleed onto both subjects. Regional prompting isolates attention mechanisms to user-defined bounding boxes.

## Operational Workflow

1. **Define canvas spatial segmentation map dividing canvas into rectangular or polygon regions.**:
   - Define canvas spatial segmentation map dividing canvas into rectangular or polygon regions.

2. **Assign independent prompt strings to each region (e.g., Region 1**:
   - Assign independent prompt strings to each region (e.g., Region 1: "blonde woman", Region 2: "red sportscar").

3. **Mask cross-attention weight matrices during denoising steps so prompts only attend to designated regions.**:
   - Mask cross-attention weight matrices during denoising steps so prompts only attend to designated regions.

4. **Blend boundary margins smoothly across latent space to avoid visible seam artifacts.**:
   - Blend boundary margins smoothly across latent space to avoid visible seam artifacts.

## Recommended Tools & Environments
- Regional Prompting
- Attention Masking
- Multi-Subject Generation
- Diffusers

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
