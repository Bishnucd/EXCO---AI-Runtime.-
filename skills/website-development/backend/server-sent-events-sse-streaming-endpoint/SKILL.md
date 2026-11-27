---
name: server-sent-events-sse-streaming-endpoint
description: Builds scalable, persistent Server-Sent Events (SSE) HTTP streaming endpoints with auto-reconnect. Use when streaming LLM tokens, live notifications, or dashboard tickers to browsers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events"
---
# Server Sent Events Sse Streaming Endpoint

## Overview
WebSockets require custom protocols and fail through corporate HTTP proxies. SSE uses standard HTTP with text/event-stream headers, providing native browser EventSource support and auto-reconnect.

## Operational Workflow

1. **Configure backend HTTP endpoint returning Content-Type**:
   - Configure backend HTTP endpoint returning Content-Type: text/event-stream with Cache-Control: no-cache.

2. **Format streaming output lines following SSE specification**:
   - Format streaming output lines following SSE specification: data: {"token": "hello"}\n\n.

3. **Assign event IDs (id**:
   - Assign event IDs (id: 12345) to allow client EventSource to resume via Last-Event-ID header on disconnect.

4. **Transmit periodic comment pings (**:
   - Transmit periodic comment pings (: keepalive\n\n) every 15 seconds to prevent proxy timeouts.

## Recommended Tools & Environments
- Server-Sent Events (SSE)
- HTTP Streaming
- FastAPI / Express
- Real-Time

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
