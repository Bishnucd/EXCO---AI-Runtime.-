---
name: pelias-geocoder-autocomplete-api
description: Implements fast real-time address autocomplete and search queries using the open-source Pelias geocoder. Use when building address search inputs with instant typeahead suggestions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pelias.io/"
---
# Pelias Geocoder Autocomplete Api

## Overview
Pelias is a modular, open-source geocoding engine built on Elasticsearch. Its /v1/autocomplete endpoint delivers sub-50ms address suggestions prioritized by user focus points.

## Operational Workflow

1. **Capture partial address input keystrokes with 250ms debouncing.**:
   - Capture partial address input keystrokes with 250ms debouncing.

2. **Query /v1/autocomplete passing text and focus.point.lat/lon for localized boosting.**:
   - Query /v1/autocomplete passing text and focus.point.lat/lon for localized boosting.

3. **Parse returned GeoJSON FeatureCollection extracting label and confidence scores.**:
   - Parse returned GeoJSON FeatureCollection extracting label and confidence scores.

4. **Render typeahead suggestion dropdown displaying formatted street and city matches.**:
   - Render typeahead suggestion dropdown displaying formatted street and city matches.

## Recommended Tools & Environments
- Pelias Geocoder
- Elasticsearch
- Node.js / REST
- GeoJSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
