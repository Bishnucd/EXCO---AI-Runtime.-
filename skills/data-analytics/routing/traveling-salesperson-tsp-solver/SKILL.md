---
name: traveling-salesperson-tsp-solver
description: Solves Traveling Salesperson and vehicle routing optimization problems using Google OR-Tools. Use when optimizing multi-stop delivery routes and minimizing total travel distance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/optimization/routing/tsp"
---
# Traveling Salesperson Tsp Solver

## Overview
Multi-stop routing suffers from combinatorial explosion. Constraint programming solvers use distance matrices and metaheuristics (guided local search) to find near-optimal routes in seconds.

## Operational Workflow

1. **Calculate distance/duration cost matrix between all pairs of coordinate stops.**:
   - Calculate distance/duration cost matrix between all pairs of coordinate stops.

2. **Initialize OR-Tools RoutingIndexManager and RoutingModel with depot and node count.**:
   - Initialize OR-Tools RoutingIndexManager and RoutingModel with depot and node count.

3. **Set transit cost callback evaluating travel time or distance.**:
   - Set transit cost callback evaluating travel time or distance.

4. **Execute solver with local search metaheuristics and output optimal sequential stop sequence.**:
   - Execute solver with local search metaheuristics and output optimal sequential stop sequence.

## Recommended Tools & Environments
- Python 3.10+
- Google OR-Tools
- Distance Matrix API
- NumPy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
