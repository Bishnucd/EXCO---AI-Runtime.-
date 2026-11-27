---
name: perspective-transform-document-deskew
description: Detects 4-point polygon document corners and rectifies skewed perspectives using OpenCV homography matrices. Use when flattening photographed receipts, forms, and documents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html"
---
# Perspective Transform Document Deskew

## Overview
Photographs of paper documents taken at an angle suffer from keystone distortion. Finding the 4 document corners and applying getPerspectiveTransform maps the warped quad back to a flat rectangle.

## Operational Workflow

1. **Detect paper document boundary contour using thresholding and polygon approximation (cv2.approxPolyDP).**:
   - Detect paper document boundary contour using thresholding and polygon approximation (cv2.approxPolyDP).

2. **Sort corner coordinates into top-left, top-right, bottom-right, and bottom-left order.**:
   - Sort corner coordinates into top-left, top-right, bottom-right, and bottom-left order.

3. **Compute perspective transformation matrix using cv2.getPerspectiveTransform(src_pts, dst_pts).**:
   - Compute perspective transformation matrix using cv2.getPerspectiveTransform(src_pts, dst_pts).

4. **Warp image using cv2.warpPerspective to produce a perfectly rectangular, front-facing document.**:
   - Warp image using cv2.warpPerspective to produce a perfectly rectangular, front-facing document.

## Recommended Tools & Environments
- OpenCV
- Perspective Transform
- Homography
- Document Scanning

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
