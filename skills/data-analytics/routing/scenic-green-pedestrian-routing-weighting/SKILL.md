---
name: scenic-green-pedestrian-routing-weighting
description: Calculates pleasant pedestrian routes prioritizing tree-lined parks, riverways, and low-noise streets over highways. Use when designing recreational walking and running route generators.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://openrouteservice.org/dev/#/api-docs/v2/directions/{profile}/get"
---
# Scenic Green Pedestrian Routing Weighting

## Overview
Pedestrians and runners prefer green, quiet streets over noisy car boulevards. Green routing penalizes road edges with high traffic noise and rewards paths through urban parks and waterways.

## Operational Workflow

1. **Extract OpenStreetMap amenity attributes**:
   - Extract OpenStreetMap amenity attributes: leisure=park, waterway, natural=tree, highway=pedestrian.

2. **Assign positive cost modifiers (cost reduction) to green corridors and riverside paths.**:
   - Assign positive cost modifiers (cost reduction) to green corridors and riverside paths.

3. **Assign heavy cost penalties to multi-lane arterial roads and industrial zones.**:
   - Assign heavy cost penalties to multi-lane arterial roads and industrial zones.

4. **Compute walking routes that maximize greenery and tranquility with minimal distance detour.**:
   - Compute walking routes that maximize greenery and tranquility with minimal distance detour.

## Recommended Tools & Environments
- OpenRouteService (ORS)
- Green Routing
- Pedestrian Profiles
- OSM

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
