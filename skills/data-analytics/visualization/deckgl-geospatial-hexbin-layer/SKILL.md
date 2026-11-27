---
name: deckgl-geospatial-hexbin-layer
description: Renders GPU-powered hexagonal binning layers over high-density spatial datasets using Deck.gl. Use when aggregating millions of GPS coordinates into interactive heatmaps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://deck.gl/docs/api-reference/aggregation-layers/hexagon-layer"
---
# Deckgl Geospatial Hexbin Layer

## Overview
Deck.gl binds directly to WebGL vertex buffers to aggregate millions of raw point telemetry coordinates into dynamic 3D extruded hexagonal prisms on interactive basemaps.

## Operational Workflow

1. **Load dense geospatial coordinate array into Deck.gl HexagonLayer data source.**:
   - Load dense geospatial coordinate array into Deck.gl HexagonLayer data source.

2. **Configure hexagon radius (meters), elevation scale, and color ramp thresholds.**:
   - Configure hexagon radius (meters), elevation scale, and color ramp thresholds.

3. **Bind pickable tooltip handler to inspect aggregate count and metrics per hexagon cell.**:
   - Bind pickable tooltip handler to inspect aggregate count and metrics per hexagon cell.

4. **Render overlay within MapLibre or Mapbox GL interactive viewport canvas.**:
   - Render overlay within MapLibre or Mapbox GL interactive viewport canvas.

## Recommended Tools & Environments
- Deck.gl
- Uber H3
- WebGL2
- MapLibre / Mapbox

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
