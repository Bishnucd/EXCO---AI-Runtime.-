---
name: reverse-image-search-forensic-source-tracing
description: Traces original publication origins and stolen creative assets across Google Vision, TinEye, and Yandex. Use when verifying photo authenticity and identifying original photographers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cloud.google.com/vision/docs/detecting-web"
---
# Reverse Image Search Forensic Source Tracing

## Overview
Misinformation often pairs real photographs with false contextual headlines. Reverse image search queries global web indexes to find the earliest appearance, original high-res source, and creator context.

## Operational Workflow

1. **Extract candidate image and generate perceptual hash or feed raw image into Google Cloud Vision API.**:
   - Extract candidate image and generate perceptual hash or feed raw image into Google Cloud Vision API.

2. **Query WebDetection endpoint to retrieve matching web pages, visually similar images, and best guess labels.**:
   - Query WebDetection endpoint to retrieve matching web pages, visually similar images, and best guess labels.

3. **Sort discovered page appearances chronologically to isolate the absolute earliest historical publication date.**:
   - Sort discovered page appearances chronologically to isolate the absolute earliest historical publication date.

4. **Compare original caption and photographer attribution against current viral claims to identify deception.**:
   - Compare original caption and photographer attribution against current viral claims to identify deception.

## Recommended Tools & Environments
- Reverse Image Search
- Google Cloud Vision Web Detection
- TinEye
- Image Forensics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
