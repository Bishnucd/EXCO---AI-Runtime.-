---
name: sprint-velocity-capacity-planner
description: Calculates agile team sprint capacity, historical velocity rolling averages, and load balancing. Use when planning realistic sprint workloads and preventing team burnout.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.scrum.org/resources/what-is-scrum"
---
# Sprint Velocity Capacity Planner

## Overview
Overcommitting in sprint planning causes incomplete deliverables and team morale collapse. Factoring team PTO, on-call duties, and rolling velocity averages establishes sustainable sprint commitments.

## Operational Workflow

1. **Calculate gross available developer hours factoring vacation, holidays, and on-call rotations.**:
   - Calculate gross available developer hours factoring vacation, holidays, and on-call rotations.

2. **Compute historical team rolling velocity (average story points completed across last 3-5 sprints).**:
   - Compute historical team rolling velocity (average story points completed across last 3-5 sprints).

3. **Adjust capacity factor for technical debt, unplanned bug interruptions, and operational overhead.**:
   - Adjust capacity factor for technical debt, unplanned bug interruptions, and operational overhead.

4. **Commit to sprint backlog items whose cumulative story points strictly match planned capacity.**:
   - Commit to sprint backlog items whose cumulative story points strictly match planned capacity.

## Recommended Tools & Environments
- Agile / Scrum
- Story Points
- Jira / Linear
- Spreadsheets

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
