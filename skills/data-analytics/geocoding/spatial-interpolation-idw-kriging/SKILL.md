---
name: spatial-interpolation-idw-kriging
description: Interpolates continuous continuous surface raster grids from sparse spatial point measurements using Inverse Distance Weighting (IDW). Use when generating temperature and pollution heatmaps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.griddata.html"
---
# Spatial Interpolation Idw Kriging

## Overview
Sensor stations provide readings only at specific coordinates. Spatial interpolation algorithms (IDW, Kriging) estimate continuous surface values across regular grid lattices, producing smooth heatmaps.

## Operational Workflow

1. **Collect point coordinate observations with numeric attribute values (temperature, air quality PM2.5).**:
   - Collect point coordinate observations with numeric attribute values (temperature, air quality PM2.5).

2. **Generate regular 2D meshgrid spanning the bounding box region.**:
   - Generate regular 2D meshgrid spanning the bounding box region.

3. **Execute Inverse Distance Weighting**:
   - Execute Inverse Distance Weighting: estimate grid point values using inverse distance power decay.

4. **Render interpolated surface as contoured raster or export to georeferenced GeoTIFF.**:
   - Render interpolated surface as contoured raster or export to georeferenced GeoTIFF.

## Recommended Tools & Environments
- SciPy griddata
- NumPy
- Spatial Interpolation (IDW)
- GeoTIFF

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
