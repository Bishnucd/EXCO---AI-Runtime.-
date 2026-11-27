---
name: graphhopper-matrix-distance-api
description: Computes large-scale many-to-many (N x M) travel time and distance cost matrices using GraphHopper. Use when calculating cost matrices for dispatching, logistics, and clustering.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.graphhopper.com/documentation/"
---
# Graphhopper Matrix Distance Api

## Overview
Vehicle routing solvers require knowing travel time between every pair of delivery stops. GraphHopper Matrix API calculates dense NxM distance matrices over road networks in milliseconds.

## Operational Workflow

1. **Define array of origin coordinates and array of destination coordinates.**:
   - Define array of origin coordinates and array of destination coordinates.

2. **Query GraphHopper /matrix endpoint with selected vehicle profile (car, truck, bike).**:
   - Query GraphHopper /matrix endpoint with selected vehicle profile (car, truck, bike).

3. **Receive 2D matrix of travel durations (seconds) and route distances (meters).**:
   - Receive 2D matrix of travel durations (seconds) and route distances (meters).

4. **Feed computed distance matrix directly into vehicle routing problem (VRP) optimization solvers.**:
   - Feed computed distance matrix directly into vehicle routing problem (VRP) optimization solvers.

## Recommended Tools & Environments
- GraphHopper
- Java / REST
- Distance Matrix
- OpenStreetMap

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
