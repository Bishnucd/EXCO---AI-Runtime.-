---
name: isochrone-travel-time-mapping
description: Generates reachable travel time polygon isochrones based on multimodal road networks and transit schedules. Use when analyzing geographic accessibility, catchment areas, and service radius.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://openrouteservice.org/dev/#/api-docs/v2/isochrones"
---
# Isochrone Travel Time Mapping

## Overview
Circular Euclidean radius filters are misleading because terrain and highways dictate actual reachability. Isochrones compute exact polygonal areas reachable within 15, 30, or 60 minutes.

## Operational Workflow

1. **Select starting coordinate origin and target travel profile (driving, walking, cycling, transit).**:
   - Select starting coordinate origin and target travel profile (driving, walking, cycling, transit).

2. **Query isochrone API specifying time interval contours (e.g., [900, 1800, 2700] seconds).**:
   - Query isochrone API specifying time interval contours (e.g., [900, 1800, 2700] seconds).

3. **Parse returned GeoJSON polygons representing reachable spatial envelopes.**:
   - Parse returned GeoJSON polygons representing reachable spatial envelopes.

4. **Intersect demographic data with isochrone boundaries to evaluate target audience coverage.**:
   - Intersect demographic data with isochrone boundaries to evaluate target audience coverage.

## Recommended Tools & Environments
- OpenRouteService API / Valhalla
- GeoJSON
- Leaflet
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
