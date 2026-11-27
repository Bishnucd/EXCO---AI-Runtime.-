---
name: d3-force-directed-graph-layout
description: Implements interactive force-directed network graph layouts using D3.js physics simulations. Use when visualizing relational networks, knowledge graphs, and complex entity connections.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://d3js.org/d3-force"
---
# D3 Force Directed Graph Layout

## Overview
Relational data (social networks, citation trees, package dependencies) requires dynamic spatial layout. D3-force simulates particle physics (link attraction, charge repulsion, collision avoidance).

## Operational Workflow

1. **Structure node and link data arrays with unique entity IDs and relationship weights.**:
   - Structure node and link data arrays with unique entity IDs and relationship weights.

2. **Initialize d3.forceSimulation with forceLink, forceManyBody (repulsion), and forceCenter.**:
   - Initialize d3.forceSimulation with forceLink, forceManyBody (repulsion), and forceCenter.

3. **Bind node positions to DOM SVG circles or Canvas context on simulation tick events.**:
   - Bind node positions to DOM SVG circles or Canvas context on simulation tick events.

4. **Implement zoom, pan, and node drag-and-pin event handlers for interactive exploration.**:
   - Implement zoom, pan, and node drag-and-pin event handlers for interactive exploration.

## Recommended Tools & Environments
- D3.js
- JavaScript / TypeScript
- SVG / Canvas
- Web Workers

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
