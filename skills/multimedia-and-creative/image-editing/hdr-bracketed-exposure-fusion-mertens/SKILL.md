---
name: hdr-bracketed-exposure-fusion-mertens
description: Blends multi-exposure bracketed photos into high dynamic range imagery without tonemapping halos using Mertens exposure fusion. Use when capturing high-contrast interior architecture.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.opencv.org/4.x/d2/df0/tutorial_py_hdr.html"
---
# Hdr Bracketed Exposure Fusion Mertens

## Overview
Mertens exposure fusion blends multi-exposure brackets (-2EV, 0EV, +2EV) using contrast, saturation, and well-exposedness weight maps, producing natural HDR images without synthetic halos.

## Operational Workflow

1. **Load aligned sequence of bracketed exposure images (under-exposed, normal, over-exposed).**:
   - Load aligned sequence of bracketed exposure images (under-exposed, normal, over-exposed).

2. **Instantiate OpenCV Mertens merge object with cv2.createMergeMertens().**:
   - Instantiate OpenCV Mertens merge object with cv2.createMergeMertens().

3. **Compute normalized fusion weight maps for contrast, saturation, and luminance across frames.**:
   - Compute normalized fusion weight maps for contrast, saturation, and luminance across frames.

4. **Blend images across Laplacian pyramid levels and scale 32-bit floating point output to 8-bit RGB.**:
   - Blend images across Laplacian pyramid levels and scale 32-bit floating point output to 8-bit RGB.

## Recommended Tools & Environments
- Exposure Fusion
- Mertens Algorithm
- OpenCV
- HDR Photography

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
