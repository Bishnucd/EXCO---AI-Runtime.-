---
name: mbtiles-vector-tile-pyramid-bundler
description: Packages multi-resolution vector map tiles into compact SQLite MBTiles databases using tippecanoe. Use when serving offline mobile maps and fast web vector tile layers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/felt/tippecanoe"
---
# Mbtiles Vector Tile Pyramid Bundler

## Overview
Serving individual map tile files creates millions of tiny files. MBTiles packages vector tile pyramids (Z/X/Y) into a single optimized SQLite database file for blazing-fast mobile and web hosting.

## Operational Workflow

1. **Ingest GeoJSON feature datasets into tippecanoe.**:
   - Ingest GeoJSON feature datasets into tippecanoe.

2. **Configure zoom range (e.g. -z14 -Z0) and feature dropping heuristics for smooth zoom scaling.**:
   - Configure zoom range (e.g. -z14 -Z0) and feature dropping heuristics for smooth zoom scaling.

3. **Execute tippecanoe to generate compressed protocol buffer vector tiles in .mbtiles SQLite archive.**:
   - Execute tippecanoe to generate compressed protocol buffer vector tiles in .mbtiles SQLite archive.

4. **Serve tiles over HTTP using lightweight tile servers or embed directly in offline mobile apps.**:
   - Serve tiles over HTTP using lightweight tile servers or embed directly in offline mobile apps.

## Recommended Tools & Environments
- tippecanoe
- MBTiles
- Mapbox Vector Tiles (MVT)
- SQLite

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
