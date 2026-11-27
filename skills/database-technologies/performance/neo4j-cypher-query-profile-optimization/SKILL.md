---
name: neo4j-cypher-query-profile-optimization
description: Profiles and tunes Cypher graph database queries using PROFILE and EXPLAIN in Neo4j. Use when eliminating Cartesian products and reducing db hits in complex graph traversals.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://neo4j.com/docs/cypher-manual/current/query-tuning/"
---
# Neo4j Cypher Query Profile Optimization

## Overview
Graph queries can inadvertently trigger exponential traversals. Running PROFILE inspects the exact Cypher execution plan, revealing NodeByLabelScan, Expand(All), and excessive db hits.

## Operational Workflow

1. **Prepend PROFILE to slow Cypher traversal query in Neo4j Browser or Cypher shell.**:
   - Prepend PROFILE to slow Cypher traversal query in Neo4j Browser or Cypher shell.

2. **Analyze execution plan tree identifying operators with disproportionate Rows and DbHits.**:
   - Analyze execution plan tree identifying operators with disproportionate Rows and DbHits.

3. **Add schema indexes on starting node search properties (CREATE INDEX FOR (p**:
   - Add schema indexes on starting node search properties (CREATE INDEX FOR (p:Person) ON (p.id)).

4. **Refactor query pattern to anchor traversal on the most selective node before expanding relationships.**:
   - Refactor query pattern to anchor traversal on the most selective node before expanding relationships.

## Recommended Tools & Environments
- Neo4j
- Cypher Query Language
- Graph Database
- Query Profiling

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
