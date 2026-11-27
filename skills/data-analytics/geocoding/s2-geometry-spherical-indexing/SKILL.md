---
name: s2-geometry-spherical-indexing
description: Indexes geographic points and polygons onto hierarchical Hilbert curve cells using Google S2 Geometry. Use when executing lightning-fast spatial containment and proximity queries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://s2geometry.io/"
---
# S2 Geometry Spherical Indexing

## Overview
Google S2 projects the sphere onto a cube, decomposing surfaces into hierarchical quad-tree cells indexed by 64-bit integers along a Hilbert curve, enabling fast 1D B-tree spatial range queries.

## Operational Workflow

1. **Convert latitude and longitude coordinates into S2LatLng point objects.**:
   - Convert latitude and longitude coordinates into S2LatLng point objects.

2. **Generate 64-bit integer S2CellId at designated hierarchy level (levels 0-30).**:
   - Generate 64-bit integer S2CellId at designated hierarchy level (levels 0-30).

3. **Cover polygon boundaries with minimal collections of S2CellId ranges using S2RegionCoverer.**:
   - Cover polygon boundaries with minimal collections of S2CellId ranges using S2RegionCoverer.

4. **Execute spatial intersection queries using integer range searches in standard databases.**:
   - Execute spatial intersection queries using integer range searches in standard databases.

## Recommended Tools & Environments
- Google S2 Geometry
- C++ / Python / Go
- Hilbert Curve
- Spatial Indexing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
