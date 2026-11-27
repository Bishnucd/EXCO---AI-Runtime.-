---
name: pgrouting-shortest-path-dijkstra-astar
description: Executes topological graph routing algorithms (Dijkstra, A*, Driving Distance) directly inside PostgreSQL using pgRouting. Use when querying routing graphs stored in relational databases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://pgrouting.org/documentation.html"
---
# Pgrouting Shortest Path Dijkstra Astar

## Overview
pgRouting adds graph routing capabilities to PostGIS databases, allowing developers to run shortest path queries (pgr_dijkstra, pgr_astar) directly inside SQL queries without external services.

## Operational Workflow

1. **Build topological network graph from road line strings using pgr_createTopology().**:
   - Build topological network graph from road line strings using pgr_createTopology().

2. **Execute SELECT * FROM pgr_dijkstra('SELECT id, source, target, cost FROM roads', start_node, end_node).**:
   - Execute SELECT * FROM pgr_dijkstra('SELECT id, source, target, cost FROM roads', start_node, end_node).

3. **Join result node sequence with road geometry table to construct continuous spatial line.**:
   - Join result node sequence with road geometry table to construct continuous spatial line.

4. **Filter routing edges dynamically by vehicle weight, height restrictions, and road closures in SQL.**:
   - Filter routing edges dynamically by vehicle weight, height restrictions, and road closures in SQL.

## Recommended Tools & Environments
- pgRouting
- PostGIS
- PostgreSQL
- SQL Graph Routing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
