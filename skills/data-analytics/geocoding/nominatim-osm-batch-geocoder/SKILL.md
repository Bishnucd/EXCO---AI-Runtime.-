---
name: nominatim-osm-batch-geocoder
description: Geocodes address strings into WGS84 coordinates using OpenStreetMap Nominatim with rate-limit compliance. Use when batch-geocoding physical addresses without paid API keys.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://nominatim.org/release-docs/latest/api/Search/"
---
# Nominatim Osm Batch Geocoder

## Overview
OpenStreetMap Nominatim provides free geocoding. Implementing polite 1-second request delays, custom user-agent headers, and local caching satisfies OSM Usage Policies while geocoding datasets.

## Operational Workflow

1. **Clean and format raw address strings (street, city, state, postal code, country).**:
   - Clean and format raw address strings (street, city, state, postal code, country).

2. **Query Nominatim search API with format=jsonv2 and addressdetails=1.**:
   - Query Nominatim search API with format=jsonv2 and addressdetails=1.

3. **Enforce strict 1-second delay between consecutive requests to honor OSM usage limits.**:
   - Enforce strict 1-second delay between consecutive requests to honor OSM usage limits.

4. **Extract lat, lon, boundingbox, and place_rank attributes into structured records.**:
   - Extract lat, lon, boundingbox, and place_rank attributes into structured records.

## Recommended Tools & Environments
- Nominatim API
- OpenStreetMap
- Python geopy
- WGS84

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
