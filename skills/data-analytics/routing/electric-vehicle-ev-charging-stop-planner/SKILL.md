---
name: electric-vehicle-ev-charging-stop-planner
description: Plans long-distance electric vehicle routes optimizing battery consumption, charging station stops, and charging times. Use when routing EVs with range constraints and elevation awareness.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/graphhopper/graphhopper/blob/master/docs/core/ev.md"
---
# Electric Vehicle Ev Charging Stop Planner

## Overview
EV routing must model kilowatt-hour consumption based on vehicle aerodynamics, speed, elevation gain, and regenerative braking, inserting high-speed DC charging stops when battery reaches 15%.

## Operational Workflow

1. **Model vehicle battery state-of-charge (SoC), capacity (kWh), and charging power curves.**:
   - Model vehicle battery state-of-charge (SoC), capacity (kWh), and charging power curves.

2. **Compute energy consumption per road segment factoring elevation gradient and speed.**:
   - Compute energy consumption per road segment factoring elevation gradient and speed.

3. **Insert DC fast-charging station stops when battery drops below safety threshold (e.g. 15% SoC).**:
   - Insert DC fast-charging station stops when battery drops below safety threshold (e.g. 15% SoC).

4. **Optimize total travel duration**:
   - Optimize total travel duration: minimize driving time plus necessary battery charging dwell time.

## Recommended Tools & Environments
- EV Routing
- Battery Consumption Models
- GraphHopper / OpenRouteService
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
