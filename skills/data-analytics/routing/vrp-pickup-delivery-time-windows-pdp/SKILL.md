---
name: vrp-pickup-delivery-time-windows-pdp
description: Solves Pickup and Delivery Problems with Time Windows (PDPTW) and vehicle capacities using Google OR-Tools. Use when routing couriers transporting packages between multiple customer locations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/optimization/routing/pdp"
---
# Vrp Pickup Delivery Time Windows Pdp

## Overview
Couriers must pick up items from senders before delivering them to recipients while respecting vehicle capacity and customer time windows. PDPTW solvers enforce strict pickup-before-delivery constraints.

## Operational Workflow

1. **Define paired pickup and delivery nodes with order weights and customer delivery time windows.**:
   - Define paired pickup and delivery nodes with order weights and customer delivery time windows.

2. **Add PickupAndDelivery constraint to RoutingModel enforcing pickup precedes dropoff in the same vehicle.**:
   - Add PickupAndDelivery constraint to RoutingModel enforcing pickup precedes dropoff in the same vehicle.

3. **Configure dimension trackers accumulating vehicle cargo load and elapsed route time.**:
   - Configure dimension trackers accumulating vehicle cargo load and elapsed route time.

4. **Solve optimization model using guided local search to minimize total fleet driving time.**:
   - Solve optimization model using guided local search to minimize total fleet driving time.

## Recommended Tools & Environments
- Google OR-Tools
- PDPTW
- Vehicle Routing
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
