---
name: chromatic-aberration-correction-lens
description: Corrects lateral chromatic aberration color fringing around high-contrast edges using radial lens models. Use when cleaning raw camera captures taken with wide-angle lenses.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Chromatic_aberration"
---
# Chromatic Aberration Correction Lens

## Overview
Camera lenses refract red, green, and blue wavelengths at slightly different angles, causing purple and green fringes at frame edges. Radial scaling of red and blue channels eliminates fringes.

## Operational Workflow

1. **Decompose image into isolated Red, Green, and Blue color channels.**:
   - Decompose image into isolated Red, Green, and Blue color channels.

2. **Apply radial polynomial scaling function to Red and Blue channels relative to the optical center.**:
   - Apply radial polynomial scaling function to Red and Blue channels relative to the optical center.

3. **Recombine aligned color channels back into unified RGB image.**:
   - Recombine aligned color channels back into unified RGB image.

4. **Verify that high-contrast edge boundaries (e.g., tree branches against sky) show zero purple fringing.**:
   - Verify that high-contrast edge boundaries (e.g., tree branches against sky) show zero purple fringing.

## Recommended Tools & Environments
- Chromatic Aberration
- Lens Correction
- OpenCV / RawPy
- Color Fringing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
