---
name: reverse-geocoding-spatial-lookup
description: Converts latitude/longitude coordinates into normalized street addresses and administrative boundaries. Use when enriching location coordinate streams with human-readable address data.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://nominatim.org/release-docs/latest/api/Reverse/"
---
# Reverse Geocoding Spatial Lookup

## Overview
Raw GPS coordinates are unintelligible to human users. Reverse geocoding resolves point coordinates against spatial polygonal boundaries and road networks to produce standardized addresses.

## Operational Workflow

1. **Validate latitude (-90 to 90) and longitude (-180 to 180) coordinate ranges.**:
   - Validate latitude (-90 to 90) and longitude (-180 to 180) coordinate ranges.

2. **Query reverse geocoding API or spatial index with spatial tolerance buffers.**:
   - Query reverse geocoding API or spatial index with spatial tolerance buffers.

3. **Parse administrative hierarchy**:
   - Parse administrative hierarchy: street number, road, neighborhood, city, state, postal code, country.

4. **Cache resolved addresses in spatial key-value stores to avoid redundant lookup costs.**:
   - Cache resolved addresses in spatial key-value stores to avoid redundant lookup costs.

## Recommended Tools & Environments
- Nominatim / OpenStreetMap
- Python
- Shapely
- GeoPandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
