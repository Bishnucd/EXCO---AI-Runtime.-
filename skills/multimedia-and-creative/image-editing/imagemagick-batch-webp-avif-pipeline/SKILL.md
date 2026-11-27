---
name: imagemagick-batch-webp-avif-pipeline
description: Converts and compresses image archives into modern WebP and AVIF formats using ImageMagick 7. Use when automating web asset optimization pipelines with high visual quality.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://imagemagick.org/script/command-line-processing.php"
---
# Imagemagick Batch Webp Avif Pipeline

## Overview
ImageMagick provides a robust CLI engine for image manipulation. Modern web optimization requires converting legacy PNG/JPEG files to next-gen AVIF and WebP with fine quality tuning.

## Operational Workflow

1. **Execute magick mogrify command specifying output format (-format avif or -format webp).**:
   - Execute magick mogrify command specifying output format (-format avif or -format webp).

2. **Tune compression quality (-quality 80) and chroma subsampling (-define heic**:
   - Tune compression quality (-quality 80) and chroma subsampling (-define heic:chroma=420).

3. **Strip unnecessary metadata profiles (-strip) to eliminate superfluous byte overhead.**:
   - Strip unnecessary metadata profiles (-strip) to eliminate superfluous byte overhead.

4. **Benchmark file size reduction and visually verify Structural Similarity (SSIM > 0.95).**:
   - Benchmark file size reduction and visually verify Structural Similarity (SSIM > 0.95).

## Recommended Tools & Environments
- ImageMagick 7
- WebP / AVIF
- Batch Image Processing
- Compression

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
