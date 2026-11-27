---
name: testcontainers-ephemeral-docker-testing
description: Provisions real ephemeral PostgreSQL, Redis, and Kafka Docker containers in integration tests with Testcontainers. Use when eliminating flaky in-memory database mocks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://testcontainers.com/"
---
# Testcontainers Ephemeral Docker Testing

## Overview
In-memory databases (H2, sqlite) don't support advanced PostgreSQL features (JSONB, CTEs). Testcontainers spins up real Docker containers during test startup and terminates them cleanly on completion.

## Operational Workflow

1. **Initialize container instance in test**:
   - Initialize container instance in test: const container = await new PostgreSqlContainer().start().

2. **Extract dynamic container connection string and pass to application database pool configuration.**:
   - Extract dynamic container connection string and pass to application database pool configuration.

3. **Apply database schema migrations and run integration tests against the authentic database engine.**:
   - Apply database schema migrations and run integration tests against the authentic database engine.

4. **Container automatically shuts down and self-cleans upon test process exit via Ryuk sidecar.**:
   - Container automatically shuts down and self-cleans upon test process exit via Ryuk sidecar.

## Recommended Tools & Environments
- Testcontainers
- Docker
- Integration Testing
- Real Databases

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
