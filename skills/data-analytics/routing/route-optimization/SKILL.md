---
name: route-optimization
description: Builds and validates a multi-stop route plan from a list of locations, time windows, vehicle capacity, and driver constraints, then explains why the solver's answer is or is not trustworthy. Use when planning deliveries, service visits, or field work, or when a route plan looks wrong.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Route Optimization

Optimisation without validation produces confident nonsense. This skill defines the problem,
solves it, then checks the answer against reality.

## When to use

- Planning daily deliveries or service visits with more than ~8 stops.
- Comparing a proposed plan against the current manual route.
- Diagnosing a plan that assigns an impossible sequence.
- Adding time windows or capacity to an existing plan.

## Workflow

### 1. Define the problem completely

A route problem is under-specified until all of these are answered:

| Element | Question |
|---------|----------|
| Depot | Where does each route start and end? |
| Stops | Coordinates, service duration, demand |
| Vehicles | How many, capacity per dimension, fixed and per-km cost |
| Time windows | Per stop; hard or soft? |
| Drivers | Shift start/end, mandatory breaks, max driving hours |
| Travel model | Straight-line, road network, or a traffic-aware matrix |
| Objective | Minimise distance, time, cost, or lateness? In what priority? |
| Constraints | One-way streets, access restrictions, vehicle height/weight, customer preferences |

If any of these is missing, state the assumption explicitly and mark the plan provisional.

### 2. Get a travel-time matrix, not distances

Use a routing provider's matrix for the actual road network. Straight-line distance
underestimates travel by 30–60% in cities and produces plans that are impossible to drive.

Cache the matrix. A 200-stop problem is 40,000 pairs; recomputing per solver iteration is slow
and expensive.

### 3. Choose the solver by size

| Stops | Approach |
|-------|----------|
| ≤ 10 | Exact (brute force or dynamic programming) |
| 11–50 | Heuristic: nearest neighbour + 2-opt, or OR-Tools with a time limit |
| 51–500 | OR-Tools with guided local search, time-limited |
| > 500 | Cluster first (geographic sectors), then solve per cluster |

Always report the solver's gap or whether it hit the time limit. "Optimal" is a claim that
requires proof.

### 4. Model the constraints that actually bind

- **Time windows:** hard windows produce infeasible problems quickly. Report infeasibility and
  the minimum relaxation needed (which window, by how many minutes) rather than silently
  dropping stops.
- **Capacity:** track every dimension (weight, volume, count), not just one.
- **Driving hours:** insert breaks and enforce daily limits.
- **Service time:** include it; a 15-minute stop × 40 stops is 10 hours.

### 5. Validate the output against the physical world

Before presenting a plan:

- Every stop appears exactly once.
- Sequence respects every time window and break.
- Capacity is not exceeded on any leg.
- Total driving time is within legal limits.
- No leg is implausibly fast (implies a bad matrix entry).
- Compare against the naive baseline: current manual route, or nearest-neighbour. Report the
  improvement as a percentage, not an absolute claim.

### 6. Present with the assumptions

A route plan is only as good as its inputs. State: matrix source and timestamp, traffic model,
assumed service times, and which constraints were relaxed.

## Rules

- Never present a plan as "optimal" without a proven optimality gap of zero.
- Never drop a stop to make the problem feasible; report infeasibility.
- Never use straight-line distance for a plan that will actually be driven, unless the user
  explicitly accepts the approximation.
- Never average coordinates for a multi-stop location; use a real access point.
- Respect provider terms for matrix and geocoding usage.

## Output format

```markdown
# Route plan: <date> – <fleet>

## Assumptions
depot, matrix source and time, traffic model, service times, objective and priority

## Result
| Route | Vehicle | Stops | Distance | Driving | Service | Window violations |
|-------|---------|-------|----------|---------|---------|-------------------|

## Sequence
Route 1: depot → stop 14 (08:05–08:20) → stop 3 (08:41–08:56) → ... → depot (17:10)

## Validation
- all stops assigned: yes
- capacity respected: yes
- windows respected: yes, 0 violations
- driving hours within limit: yes
- improvement vs baseline: −18% distance, −11% time

## Not satisfied / relaxed
- <constraint> — reason and impact
```

## Error handling

| Condition | Action |
|-----------|--------|
| Problem is infeasible | Report which constraint set conflicts, and the smallest relaxation that makes it feasible |
| Matrix provider rate-limited | Use cached entries; report coverage; do not substitute straight-line silently |
| Solver hits its time limit | Report the gap and the best solution found; label it "not proven optimal" |
| Stop coordinates are low precision | Flag them; a city-centroid stop invalidates the leg times |

## Example

**Input:** 62 deliveries, 4 vans, 08:00–17:00 windows, 20-minute service, London.
**Output:** a 4-route plan, 0 window violations, −18% distance versus the manual route, a note
that two stops are only city-precision and may add 10 minutes each, and the exact matrix
timestamp used.
