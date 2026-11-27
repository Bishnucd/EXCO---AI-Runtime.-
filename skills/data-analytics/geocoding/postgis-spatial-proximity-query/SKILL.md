---
name: postgis-spatial-proximity-query
description: Authors optimized spatial queries using PostGIS GiST index operators and ST_DWithin distance functions. Use when querying database records based on geographic radius and proximity.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://postgis.net/documentation/"
---
# Postgis Spatial Proximity Query

## Overview
Calculating geographic distances using Pythagorean formulas fails due to Earth curvature and causes full table scans. PostGIS GiST indexes and spheroid spatial functions provide sub-millisecond lookups.

## Operational Workflow

1. **Define GEOMETRY(Point, 4326) or GEOGRAPHY columns and build spatial GiST indexes.**:
   - Define GEOMETRY(Point, 4326) or GEOGRAPHY columns and build spatial GiST indexes.

2. **Construct queries utilizing ST_DWithin to leverage index-accelerated bounding box filtering.**:
   - Construct queries utilizing ST_DWithin to leverage index-accelerated bounding box filtering.

3. **Compute accurate geodesic distances in meters using ST_Distance on GEOGRAPHY types.**:
   - Compute accurate geodesic distances in meters using ST_Distance on GEOGRAPHY types.

4. **Combine spatial proximity filters with relational business logic and limit constraints.**:
   - Combine spatial proximity filters with relational business logic and limit constraints.

## Recommended Tools & Environments
- PostgreSQL
- PostGIS
- GiST Indexes
- SQL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
