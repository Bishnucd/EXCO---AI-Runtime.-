---
name: coordinate-reference-system-crs-transformation
description: Transforms geospatial coordinates across EPSG projections (WGS84, Web Mercator, State Plane, UTM) using GDAL/PROJ. Use when resolving projection mismatches and calculating accurate distances.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://proj.org/en/9.3/"
---
# Coordinate Reference System Crs Transformation

## Overview
Calculating distances or displaying maps with mismatched coordinate reference systems (CRS) causes miles of error. PROJ translates geodetic coordinates across ellipsoids and cartographic projections.

## Operational Workflow

1. **Identify source coordinate system (e.g. EPSG**:
   - Identify source coordinate system (e.g. EPSG:4326 WGS84 degrees).

2. **Select target projection**:
   - Select target projection: local State Plane (e.g. EPSG:2227) or UTM zone for meter accuracy.

3. **Initialize pyproj.Transformer with always_xy=True to enforce consistent (x, y) ordering.**:
   - Initialize pyproj.Transformer with always_xy=True to enforce consistent (x, y) ordering.

4. **Transform coordinate arrays and verify output ranges fall within expected projection bounds.**:
   - Transform coordinate arrays and verify output ranges fall within expected projection bounds.

## Recommended Tools & Environments
- PROJ / GDAL
- pyproj
- EPSG Projections
- Geodesy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
