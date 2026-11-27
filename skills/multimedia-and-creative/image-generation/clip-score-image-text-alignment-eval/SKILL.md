---
name: clip-score-image-text-alignment-eval
description: Measures semantic cosine similarity between generated images and prompt descriptions using OpenAI CLIP. Use when automatically scoring and filtering generated image quality in batch pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/openai/CLIP"
---
# Clip Score Image Text Alignment Eval

## Overview
Manual inspection cannot scale to thousands of generated images. CLIP Score calculates the cosine similarity between the image embedding and text prompt embedding to flag prompt drift.

## Operational Workflow

1. **Encode candidate generated image through CLIP ViT-B/32 or ViT-L/14 vision transformer.**:
   - Encode candidate generated image through CLIP ViT-B/32 or ViT-L/14 vision transformer.

2. **Encode generating text prompt string through corresponding CLIP text encoder.**:
   - Encode generating text prompt string through corresponding CLIP text encoder.

3. **Calculate normalized cosine similarity score**:
   - Calculate normalized cosine similarity score: CLIP_Score = max(cos(image_vec, text_vec), 0) * 100.

4. **Filter out generations scoring below acceptable threshold (e.g., CLIP Score < 24) for automated regeneration.**:
   - Filter out generations scoring below acceptable threshold (e.g., CLIP Score < 24) for automated regeneration.

## Recommended Tools & Environments
- CLIP Score
- Image-Text Alignment
- PyTorch / TorchMetrics
- Quality Evaluation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
