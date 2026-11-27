---
name: opencv-canny-edge-detection-contour
description: Extracts object contours and structural boundaries from imagery using OpenCV Canny edge detection. Use when building computer vision preprocessing, segmentation, and vectorization pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html"
---
# Opencv Canny Edge Detection Contour

## Overview
Canny edge detection uses Gaussian blurring, Sobel gradient calculations, non-maximum suppression, and hysteresis thresholding to extract clean, thin single-pixel structural edges.

## Operational Workflow

1. **Convert image to grayscale and apply Gaussian blur (kernel size 5x5) to eliminate image noise.**:
   - Convert image to grayscale and apply Gaussian blur (kernel size 5x5) to eliminate image noise.

2. **Execute cv2.Canny(gray, threshold1=50, threshold2=150) to trace gradient edge boundaries.**:
   - Execute cv2.Canny(gray, threshold1=50, threshold2=150) to trace gradient edge boundaries.

3. **Find vector contour coordinates using cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE).**:
   - Find vector contour coordinates using cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE).

4. **Filter out small noise contours by minimum polygon area and draw outlines onto canvas.**:
   - Filter out small noise contours by minimum polygon area and draw outlines onto canvas.

## Recommended Tools & Environments
- OpenCV
- Canny Edge Detection
- Contour Extraction
- Computer Vision

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
