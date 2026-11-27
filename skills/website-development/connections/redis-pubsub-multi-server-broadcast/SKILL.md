---
name: redis-pubsub-multi-server-broadcast
description: Broadcasts real-time notifications across multiple application servers using Redis Pub/Sub channels. Use when scaling WebSocket hubs across multiple horizontal backend nodes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://redis.io/docs/latest/develop/interact/pubsub/"
---
# Redis Pubsub Multi Server Broadcast

## Overview
When clients connect to different server instances, Server A cannot push messages to clients on Server B directly. Redis Pub/Sub connects all server nodes into a unified broadcasting backplane.

## Operational Workflow

1. **Establish dedicated Redis publisher and subscriber client connections on each application node.**:
   - Establish dedicated Redis publisher and subscriber client connections on each application node.

2. **Subscribe local node to relevant notification channels (e.g., user**:
   - Subscribe local node to relevant notification channels (e.g., user:{id} or room:{id}).

3. **When an event occurs, publish JSON payload to target Redis channel via PUBLISH channel message.**:
   - When an event occurs, publish JSON payload to target Redis channel via PUBLISH channel message.

4. **All subscribed server nodes receive message instantly and push to their locally connected WebSocket clients.**:
   - All subscribed server nodes receive message instantly and push to their locally connected WebSocket clients.

## Recommended Tools & Environments
- Redis Pub/Sub
- Horizontal Scaling
- WebSocket Cluster
- Message Broadcasting

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
