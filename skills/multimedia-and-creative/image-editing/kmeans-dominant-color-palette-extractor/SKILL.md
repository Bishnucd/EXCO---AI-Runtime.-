---
name: kmeans-dominant-color-palette-extractor
description: Extracts dominant brand color palettes from imagery using K-Means unsupervised color clustering in CIELAB space. Use when generating adaptive UI themes matching hero images.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html"
---
# Kmeans Dominant Color Palette Extractor

## Overview
Extracting colors in RGB space fails because Euclidean distances do not match human color perception. Clustering pixel values in perceptually uniform CIELAB space extracts harmonious brand palettes.

## Operational Workflow

1. **Downsample image to 200x200 pixels and convert RGB pixel array to CIELAB color space.**:
   - Downsample image to 200x200 pixels and convert RGB pixel array to CIELAB color space.

2. **Fit K-Means clustering model specifying desired palette size (e.g., k=5 or k=8 clusters).**:
   - Fit K-Means clustering model specifying desired palette size (e.g., k=5 or k=8 clusters).

3. **Rank cluster centroids by pixel count to identify primary, secondary, and accent colors.**:
   - Rank cluster centroids by pixel count to identify primary, secondary, and accent colors.

4. **Convert centroid coordinates back to sRGB hex strings for dynamic CSS theme variable injection.**:
   - Convert centroid coordinates back to sRGB hex strings for dynamic CSS theme variable injection.

## Recommended Tools & Environments
- K-Means Clustering
- CIELAB Color Space
- Scikit-Learn
- UI Theming

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
