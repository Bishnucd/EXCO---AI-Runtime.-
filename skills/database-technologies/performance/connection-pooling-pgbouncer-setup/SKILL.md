---
name: connection-pooling-pgbouncer-setup
description: Configures PgBouncer connection pooling in transaction mode to manage thousands of client connections to PostgreSQL. Use when preventing connection exhaustion on PostgreSQL databases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.pgbouncer.org/usage.html"
---
# Connection Pooling Pgbouncer Setup

## Overview
PostgreSQL forks a new operating system process per connection, consuming ~10MB memory each. PgBouncer multiplexes thousands of incoming client connections onto a small pool of backend connections.

## Operational Workflow

1. **Select pooling mode**:
   - Select pooling mode: transaction mode for maximum throughput with standard ORM queries.

2. **Configure pgbouncer.ini with database definitions, user auth_file, and default_pool_size.**:
   - Configure pgbouncer.ini with database definitions, user auth_file, and default_pool_size.

3. **Tune max_client_conn (e.g. 5000) and reserve_pool_size for traffic surge buffering.**:
   - Tune max_client_conn (e.g. 5000) and reserve_pool_size for traffic surge buffering.

4. **Configure client applications to connect via PgBouncer port 6432 with prepared statement safety.**:
   - Configure client applications to connect via PgBouncer port 6432 with prepared statement safety.

## Recommended Tools & Environments
- PgBouncer
- PostgreSQL
- TCP / Unix Sockets
- Linux

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
