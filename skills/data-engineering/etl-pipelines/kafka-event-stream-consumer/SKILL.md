---
name: kafka-event-stream-consumer
description: Implements resilient, fault-tolerant Apache Kafka consumers with consumer groups and dead-letter queues. Use when streaming event ingestion and microservice event sourcing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://kafka.apache.org/documentation/"
---
# Kafka Event Stream Consumer

## Overview
Event-driven stream pipelines must process high-throughput message topics with at-least-once delivery semantics, rebalance handling, and dead-letter queue isolation for malformed messages.

## Operational Workflow

1. **Configure consumer group subscriptions with manual offset commit strategies.**:
   - Configure consumer group subscriptions with manual offset commit strategies.

2. **Implement message deserialization and validate payloads against schema registry contracts.**:
   - Implement message deserialization and validate payloads against schema registry contracts.

3. **Route unparseable or failed messages to dead-letter queue (DLQ) topics with error context.**:
   - Route unparseable or failed messages to dead-letter queue (DLQ) topics with error context.

4. **Commit consumer offsets synchronously or in batches only after successful message processing.**:
   - Commit consumer offsets synchronously or in batches only after successful message processing.

## Recommended Tools & Environments
- Apache Kafka
- librdkafka / kafka-python
- Avro / JSON Schema
- DLQ

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
