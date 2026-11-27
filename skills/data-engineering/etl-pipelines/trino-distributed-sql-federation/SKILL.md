---
name: trino-distributed-sql-federation
description: Executes federated ANSI SQL queries across heterogeneous data stores using Trino. Use when joining tables across S3 object storage, PostgreSQL, and MySQL in a single SQL query.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://trino.io/docs/current/"
---
# Trino Distributed Sql Federation

## Overview
Trino is an MPP distributed SQL query engine that queries data where it lives without data movement, joining tables across disparate data lakes, relational databases, and NoSQL engines.

## Operational Workflow

1. **Configure Trino catalogs (hive.properties, postgresql.properties, mysql.properties).**:
   - Configure Trino catalogs (hive.properties, postgresql.properties, mysql.properties).

2. **Connect BI tool or SQL client to Trino coordinator via JDBC or REST API.**:
   - Connect BI tool or SQL client to Trino coordinator via JDBC or REST API.

3. **Author cross-catalog SQL queries joining lakehouse parquet tables with operational Postgres tables.**:
   - Author cross-catalog SQL queries joining lakehouse parquet tables with operational Postgres tables.

4. **Monitor query execution stages, worker memory distribution, and data pushdown predicates.**:
   - Monitor query execution stages, worker memory distribution, and data pushdown predicates.

## Recommended Tools & Environments
- Trino
- Distributed SQL
- Federated Queries
- Data Virtualization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
