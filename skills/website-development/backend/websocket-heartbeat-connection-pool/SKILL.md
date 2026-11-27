---
name: websocket-heartbeat-connection-pool
description: Manages scalable WebSocket connection pools with ping/pong heartbeats and reconnection backoff. Use when maintaining persistent real-time connections to thousands of concurrent clients.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers"
---
# Websocket Heartbeat Connection Pool

## Overview
Silent TCP connection drops leave zombie sockets open on servers, wasting memory and missing messages. Periodic ping/pong heartbeats detect dead clients, pruning stale connections proactively.

## Operational Workflow

1. **Maintain thread-safe connection registry mapping authenticated user IDs to active WebSocket sockets.**:
   - Maintain thread-safe connection registry mapping authenticated user IDs to active WebSocket sockets.

2. **Transmit periodic ping frame to all connected clients every 30 seconds.**:
   - Transmit periodic ping frame to all connected clients every 30 seconds.

3. **Expect pong reply within 10-second timeout; terminate socket and trigger cleanup if pong is missed.**:
   - Expect pong reply within 10-second timeout; terminate socket and trigger cleanup if pong is missed.

4. **Implement exponential backoff with jitter on client reconnect logic to prevent thundering herd reconnection storms.**:
   - Implement exponential backoff with jitter on client reconnect logic to prevent thundering herd reconnection storms.

## Recommended Tools & Environments
- WebSockets
- Heartbeat Ping/Pong
- Connection Pool
- Real-Time

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
