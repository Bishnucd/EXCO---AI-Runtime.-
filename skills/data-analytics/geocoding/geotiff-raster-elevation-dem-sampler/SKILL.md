---
name: geotiff-raster-elevation-dem-sampler
description: Samples digital elevation models (DEM) and raster imagery at point coordinates using Rasterio and GDAL. Use when extracting terrain elevation, slope, and satellite values for GPS locations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://rasterio.readthedocs.io/en/stable/"
---
# Geotiff Raster Elevation Dem Sampler

## Overview
Drone missions, hiking apps, and civil engineering require elevation data. Rasterio reads georeferenced GeoTIFF elevation rasters (SRTM, Copernicus), extracting terrain height at coordinate points.

## Operational Workflow

1. **Open GeoTIFF raster dataset using rasterio.open().**:
   - Open GeoTIFF raster dataset using rasterio.open().

2. **Verify coordinate reference system and reproject sample points if necessary.**:
   - Verify coordinate reference system and reproject sample points if necessary.

3. **Sample raster band values at coordinate coordinates using dataset.sample(coords).**:
   - Sample raster band values at coordinate coordinates using dataset.sample(coords).

4. **Compute terrain derivatives**:
   - Compute terrain derivatives: calculate slope and aspect angles from neighboring raster pixels.

## Recommended Tools & Environments
- Rasterio
- GDAL
- GeoTIFF / DEM
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
