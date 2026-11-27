---
name: accessible-data-viz-color-palette
description: Generates WCAG 2.2 AA compliant, colorblind-safe color palettes for statistical data visualizations. Use when designing accessible charts for color vision deficient audiences.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://colorbrewer2.org/"
---
# Accessible Data Viz Color Palette

## Overview
Standard chart palettes (red/green) alienate the 8% of male users with color vision deficiencies. Safe palettes (Viridis, ColorBrewer) guarantee perceptual uniformity and high contrast.

## Operational Workflow

1. **Select palette type (sequential for ordered values, diverging for mid-point deviations, qualitative for categories).**:
   - Select palette type (sequential for ordered values, diverging for mid-point deviations, qualitative for categories).

2. **Verify 3**:
   - Verify 3:1 graphical object contrast ratio against background surfaces per WCAG 2.2 guidelines.

3. **Simulate palette appearance under deuteranopia, protanopia, and tritanopia color blindness.**:
   - Simulate palette appearance under deuteranopia, protanopia, and tritanopia color blindness.

4. **Combine color encodings with secondary visual cues (patterns, stroke styles, or direct text labels).**:
   - Combine color encodings with secondary visual cues (patterns, stroke styles, or direct text labels).

## Recommended Tools & Environments
- ColorBrewer
- Chroma.js
- WCAG 2.2
- CSS

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
