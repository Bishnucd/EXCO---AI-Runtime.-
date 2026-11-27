---
name: debezium-postgresql-cdc-kafka-connect
description: Captures row-level database changes from PostgreSQL Write-Ahead Logs (WAL) in real-time using Debezium and Kafka Connect. Use when streaming low-latency database events to event brokers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://debezium.io/documentation/reference/stable/connectors/postgresql.html"
---
# Debezium Postgresql Cdc Kafka Connect

## Overview
Debezium captures committed row changes from PostgreSQL logical replication slots without touching application code, publishing structured JSON/Avro events to Kafka with zero query overhead.

## Operational Workflow

1. **Enable pgoutput logical replication plugin and set wal_level = logical in postgresql.conf.**:
   - Enable pgoutput logical replication plugin and set wal_level = logical in postgresql.conf.

2. **Deploy Debezium PostgreSQL connector configuration to Kafka Connect cluster.**:
   - Deploy Debezium PostgreSQL connector configuration to Kafka Connect cluster.

3. **Configure table include lists, snapshot mode, and schema evolution handlers.**:
   - Configure table include lists, snapshot mode, and schema evolution handlers.

4. **Verify schema registry event delivery containing before and after row change payloads.**:
   - Verify schema registry event delivery containing before and after row change payloads.

## Recommended Tools & Environments
- Debezium
- Kafka Connect
- PostgreSQL WAL
- Change Data Capture (CDC)

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
