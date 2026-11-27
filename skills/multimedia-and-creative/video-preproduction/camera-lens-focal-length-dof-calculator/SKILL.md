---
name: camera-lens-focal-length-dof-calculator
description: Calculates optical depth of field, hyperfocal distance, and angle of view for cinema camera sensors and focal lengths. Use when planning shot lists, lens packages, and camera positions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Depth_of_field"
---
# Camera Lens Focal Length Dof Calculator

## Overview
Knowing exact optical depth of field prevents soft focus on set. Calculating circle of confusion, sensor crop factor, aperture f-stop, and subject distance ensures tack-sharp focus on actors.

## Operational Workflow

1. **Input camera sensor dimensions (Full Frame 36x24mm, Super35 24.89x18.66mm, or Micro Four Thirds).**:
   - Input camera sensor dimensions (Full Frame 36x24mm, Super35 24.89x18.66mm, or Micro Four Thirds).

2. **Specify lens focal length (e.g., 50mm) and selected aperture (e.g., f/2.0).**:
   - Specify lens focal length (e.g., 50mm) and selected aperture (e.g., f/2.0).

3. **Compute near focus limit, far focus limit, and total depth of field in feet/meters.**:
   - Compute near focus limit, far focus limit, and total depth of field in feet/meters.

4. **Calculate hyperfocal distance to establish maximum background focus sharpness for landscape shots.**:
   - Calculate hyperfocal distance to establish maximum background focus sharpness for landscape shots.

## Recommended Tools & Environments
- Optics Mathematics
- Depth of Field (DOF)
- Cinema Sensors
- Camera Planning

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
