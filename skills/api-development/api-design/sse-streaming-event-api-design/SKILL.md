---
name: sse-streaming-event-api-design
description: Designs real-time Server-Sent Events (SSE) endpoints with event types, IDs, and client reconnection handling. Use when streaming continuous token responses or real-time event updates over HTTP.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events"
---
# Sse Streaming Event Api Design

## Overview
SSE provides a lightweight, unidirectional HTTP streaming channel that browser EventSource clients can consume natively with built-in auto-reconnection and event ID tracking.

## Operational Workflow

1. **Set HTTP response headers**:
   - Set HTTP response headers: Content-Type: text/event-stream, Cache-Control: no-cache, Connection: keep-alive.

2. **Format stream chunks with standard fields**:
   - Format stream chunks with standard fields: event: <type>
id: <num>
data: <json>

.

3. **Read client Last-Event-ID header upon reconnection to replay missed event payloads.**:
   - Read client Last-Event-ID header upon reconnection to replay missed event payloads.

4. **Send periodic keep-alive comment lines (**:
   - Send periodic keep-alive comment lines (: ping) to prevent corporate proxy socket timeouts.

## Recommended Tools & Environments
- Server-Sent Events (SSE)
- HTTP/1.1 & HTTP/2
- Node.js / Python
- Streaming

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
