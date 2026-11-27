---
name: sharp-image-optimization-pipeline
description: Batches image resizing, WebP/AVIF format transcoding, and metadata stripping using the Node.js Sharp library. Use when optimizing responsive web images for Core Web Vitals.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://sharp.pixelplumbing.com/"
---
# Sharp Image Optimization Pipeline

## Overview
Heavy JPEG/PNG images cause poor Largest Contentful Paint (LCP) scores. Sharp leverages libvips to resize, compress, and transcode images to modern AVIF/WebP formats up to 5x faster than ImageMagick.

## Operational Workflow

1. **Read source image stream and extract dimensions and EXIF orientation metadata.**:
   - Read source image stream and extract dimensions and EXIF orientation metadata.

2. **Generate responsive breakpoint sizes (width**:
   - Generate responsive breakpoint sizes (width: 480, 768, 1200, 1920) preserving aspect ratio.

3. **Transcode to modern formats**:
   - Transcode to modern formats: AVIF (quality: 75) and WebP fallback (quality: 80).

4. **Strip unnecessary EXIF and GPS metadata to protect privacy and shave extra bytes.**:
   - Strip unnecessary EXIF and GPS metadata to protect privacy and shave extra bytes.

## Recommended Tools & Environments
- Node.js
- Sharp / libvips
- WebP / AVIF
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
