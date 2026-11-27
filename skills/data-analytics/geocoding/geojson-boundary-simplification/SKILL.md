---
name: geojson-boundary-simplification
description: Simplifies complex GeoJSON polygon boundaries using the Douglas-Peucker algorithm while preserving topology. Use when optimizing large geographic boundary files for web mapping.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://mapshaper.org/"
---
# Geojson Boundary Simplification

## Overview
High-resolution geographic boundaries contain millions of vertices, causing massive file sizes and sluggish web rendering. Topological simplification reduces polygon coordinates by up to 90%.

## Operational Workflow

1. **Ingest high-resolution GeoJSON FeatureCollections containing boundary polygons.**:
   - Ingest high-resolution GeoJSON FeatureCollections containing boundary polygons.

2. **Convert GeoJSON to TopoJSON to maintain shared arc boundaries and prevent sliver gaps.**:
   - Convert GeoJSON to TopoJSON to maintain shared arc boundaries and prevent sliver gaps.

3. **Apply Douglas-Peucker line simplification with calibrated angular tolerance thresholds.**:
   - Apply Douglas-Peucker line simplification with calibrated angular tolerance thresholds.

4. **Export lightweight simplified GeoJSON and verify that boundary containment tests remain accurate.**:
   - Export lightweight simplified GeoJSON and verify that boundary containment tests remain accurate.

## Recommended Tools & Environments
- GeoJSON
- Turf.js
- TopoJSON
- Douglas-Peucker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
