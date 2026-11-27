---
name: rate-limiting-redis-sliding-window
description: Implements distributed sliding-window log rate limiting in Redis with atomic Lua scripts. Use when protecting backend endpoints from DDoS, credential stuffing, and brute force attacks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://redis.io/glossary/rate-limiting/"
---
# Rate Limiting Redis Sliding Window

## Overview
Fixed-window rate limits allow traffic spikes at window boundaries. Redis sliding-window logs store timestamps in sorted sets (ZSET), removing expired entries and counting requests atomically.

## Operational Workflow

1. **Construct unique rate limit key based on client IP, authenticated user ID, or API key.**:
   - Construct unique rate limit key based on client IP, authenticated user ID, or API key.

2. **Execute atomic Redis Lua script**:
   - Execute atomic Redis Lua script: remove elements older than (now - window_size) using ZREMRANGEBYSCORE.

3. **Count remaining elements with ZCARD**:
   - Count remaining elements with ZCARD: if count < limit, add current timestamp with ZADD and allow request.

4. **If count >= limit, calculate retry-after duration and return HTTP 429 Too Many Requests.**:
   - If count >= limit, calculate retry-after duration and return HTTP 429 Too Many Requests.

## Recommended Tools & Environments
- Redis
- Sliding Window Rate Limiting
- Lua Scripts
- Backend Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
