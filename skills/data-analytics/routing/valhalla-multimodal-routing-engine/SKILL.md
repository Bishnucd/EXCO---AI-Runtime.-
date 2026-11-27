---
name: valhalla-multimodal-routing-engine
description: Calculates multimodal routes (pedestrian, transit, auto, bicycle) using open-source Valhalla routing engine. Use when building turn-by-turn routing with dynamic transit schedules.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://valhalla.github.io/valhalla/"
---
# Valhalla Multimodal Routing Engine

## Overview
Valhalla is an open-source routing engine designed for OpenStreetMap tile hierarchies, supporting true multimodal routing combining walking, buses, subways, and driving with elevation costs.

## Operational Workflow

1. **Initialize Valhalla route query passing origin and destination coordinate locations.**:
   - Initialize Valhalla route query passing origin and destination coordinate locations.

2. **Specify costing model**:
   - Specify costing model: auto, bicycle, pedestrian, or multimodal transit.

3. **Configure transit parameters (walking speed, maximum transfers, scheduled departure time).**:
   - Configure transit parameters (walking speed, maximum transfers, scheduled departure time).

4. **Parse returned route leg geometries, maneuver instructions, and total transit durations.**:
   - Parse returned route leg geometries, maneuver instructions, and total transit durations.

## Recommended Tools & Environments
- Valhalla
- OpenStreetMap
- C++ / REST
- Transit Routing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
