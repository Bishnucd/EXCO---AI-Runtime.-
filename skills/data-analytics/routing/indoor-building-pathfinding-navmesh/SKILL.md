---
name: indoor-building-pathfinding-navmesh
description: Performs multi-floor indoor routing across corridors, stairs, elevators, and rooms using Navigation Meshes and A*. Use when building indoor navigation for airports, hospitals, and malls.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Navigation_mesh"
---
# Indoor Building Pathfinding Navmesh

## Overview
GPS fails indoors. Indoor routing models architectural floorplans as navigation meshes (NavMesh) and floor transition portals (elevators, stairs), computing shortest accessible routes across levels.

## Operational Workflow

1. **Parse indoor architectural floorplan into walkable convex polygon navigation meshes.**:
   - Parse indoor architectural floorplan into walkable convex polygon navigation meshes.

2. **Connect vertical transition nodes (stairs, elevators, escalators) between floor layers.**:
   - Connect vertical transition nodes (stairs, elevators, escalators) between floor layers.

3. **Execute A* pathfinding finding shortest walkable corridor route between indoor points.**:
   - Execute A* pathfinding finding shortest walkable corridor route between indoor points.

4. **Generate step-by-step indoor prompts (e.g. "Take elevator to 3rd floor, turn right past Room 302").**:
   - Generate step-by-step indoor prompts (e.g. "Take elevator to 3rd floor, turn right past Room 302").

## Recommended Tools & Environments
- NavMesh
- A* Search
- Indoor Mapping (IMDF)
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
