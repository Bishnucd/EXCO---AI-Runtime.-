---
name: database-connection-pool-pgbouncer-tuning
description: Tunes PgBouncer transaction pooling, pool modes, and max client connections for PostgreSQL. Use when scaling PostgreSQL to thousands of concurrent application connections.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.pgbouncer.org/config.html"
---
# Database Connection Pool Pgbouncer Tuning

## Overview
PostgreSQL forks a heavy OS process for every direct client connection, exhausting memory at 500 connections. PgBouncer sits in front, multiplexing 10,000 clients over a pool of 50 DB connections.

## Operational Workflow

1. **Deploy PgBouncer instance and configure pgbouncer.ini with database connection parameters.**:
   - Deploy PgBouncer instance and configure pgbouncer.ini with database connection parameters.

2. **Set pool_mode = transaction to release connections back to the pool immediately after each query transaction.**:
   - Set pool_mode = transaction to release connections back to the pool immediately after each query transaction.

3. **Tune default_pool_size (e.g., 20–50) based on CPU core count of the PostgreSQL database server.**:
   - Tune default_pool_size (e.g., 20–50) based on CPU core count of the PostgreSQL database server.

4. **Point application backend connection strings to PgBouncer port 6432, monitoring stats via SHOW POOLS.**:
   - Point application backend connection strings to PgBouncer port 6432, monitoring stats via SHOW POOLS.

## Recommended Tools & Environments
- PgBouncer
- PostgreSQL
- Connection Pooling
- Backend Infrastructure

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
