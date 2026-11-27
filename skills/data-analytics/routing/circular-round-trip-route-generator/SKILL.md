---
name: circular-round-trip-route-generator
description: Generates closed-loop circular running and cycling round-trips of specified target distance starting from an origin. Use when creating recreational loop routes for fitness and cycling apps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/Project-OSRM/osrm-backend/blob/master/docs/nodejs/api.md"
---
# Circular Round Trip Route Generator

## Overview
Fitness users want a 25km cycling loop starting and ending at their front door. The algorithm picks random directional waypoints on a circle, routing a smooth closed loop matching target distance.

## Operational Workflow

1. **Select starting coordinate origin and target route distance (e.g. 20km).**:
   - Select starting coordinate origin and target route distance (e.g. 20km).

2. **Generate 3-4 intermediate waypoint coordinates along a pseudo-circular polygon perimeter.**:
   - Generate 3-4 intermediate waypoint coordinates along a pseudo-circular polygon perimeter.

3. **Compute route traversing origin -> waypoints -> origin back to start.**:
   - Compute route traversing origin -> waypoints -> origin back to start.

4. **Iterate waypoint radius until computed route distance falls within 5% of target distance.**:
   - Iterate waypoint radius until computed route distance falls within 5% of target distance.

## Recommended Tools & Environments
- OSRM / GraphHopper
- Computational Geometry
- Round Trip Generation
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
