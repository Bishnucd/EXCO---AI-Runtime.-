---
name: geopandas-spatial-join-point-in-polygon
description: Executes spatial joins (sjoin) and point-in-polygon containment checks using GeoPandas and Shapely. Use when enriching location data with neighborhood, census, or boundary attributes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://geopandas.org/en/stable/docs/user_guide/mergingdata.html#spatial-joins"
---
# Geopandas Spatial Join Point In Polygon

## Overview
Matching millions of GPS coordinates to geographic zones (census tracts, delivery zones) naively requires quadratic time. GeoPandas uses spatial R-Tree indexing to execute joins in seconds.

## Operational Workflow

1. **Load point coordinates into GeoPandas GeoDataFrame with CRS EPSG**:
   - Load point coordinates into GeoPandas GeoDataFrame with CRS EPSG:4326 (WGS84).

2. **Load boundary polygons (GeoJSON or Shapefile) and verify CRS coordinate alignment.**:
   - Load boundary polygons (GeoJSON or Shapefile) and verify CRS coordinate alignment.

3. **Execute sjoin = gpd.sjoin(points, polygons, how="inner", predicate="within").**:
   - Execute sjoin = gpd.sjoin(points, polygons, how="inner", predicate="within").

4. **Export enriched dataset containing original point metrics and matched polygon attributes.**:
   - Export enriched dataset containing original point metrics and matched polygon attributes.

## Recommended Tools & Environments
- GeoPandas
- Shapely / GEOS
- Python 3.10+
- R-Tree

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
