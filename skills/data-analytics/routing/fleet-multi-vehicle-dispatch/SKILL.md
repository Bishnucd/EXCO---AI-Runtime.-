---
name: fleet-multi-vehicle-dispatch
description: Assigns multi-stop delivery orders across vehicle fleets with capacity, shift hour, and delivery time-window constraints. Use when managing logistics fleet operations and dispatch scheduling.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/optimization/routing/cvrp"
---
# Fleet Multi Vehicle Dispatch

## Overview
Logistics fleets must balance multiple vehicles with limited carrying weight and strict customer delivery time windows. Capacitated Vehicle Routing Problem (CVRP) solvers optimize fleet allocation.

## Operational Workflow

1. **Model vehicle fleet properties**:
   - Model vehicle fleet properties: count, capacity limits, start/end depots, and driver shift limits.

2. **Define order delivery nodes with demand weight, service duration, and delivery time windows.**:
   - Define order delivery nodes with demand weight, service duration, and delivery time windows.

3. **Add dimension constraints for capacity accumulation and time window penalties.**:
   - Add dimension constraints for capacity accumulation and time window penalties.

4. **Solve optimization model and generate route itineraries for each active vehicle.**:
   - Solve optimization model and generate route itineraries for each active vehicle.

## Recommended Tools & Environments
- Python 3.10+
- Google OR-Tools
- Capacitated Vehicle Routing (CVRP)
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
