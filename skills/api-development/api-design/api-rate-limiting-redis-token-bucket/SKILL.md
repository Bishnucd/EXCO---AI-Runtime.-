---
name: api-rate-limiting-redis-token-bucket
description: Implements sliding-window and token-bucket API rate limiting algorithms backed by atomic Redis operations. Use when protecting API endpoints from abuse, credential stuffing, and noisy neighbors.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://redis.io/glossary/rate-limiting/"
---
# Api Rate Limiting Redis Token Bucket

## Overview
Rate limiting prevents service degradation from bursts or abusive clients. Sliding window log and token bucket algorithms executed via atomic Redis Lua scripts guarantee race-free quota tracking.

## Operational Workflow

1. **Select identification tier (API key, authenticated user ID, or client IP).**:
   - Select identification tier (API key, authenticated user ID, or client IP).

2. **Author an atomic Lua script executing sliding-window log checks against Redis sorted sets (ZSET).**:
   - Author an atomic Lua script executing sliding-window log checks against Redis sorted sets (ZSET).

3. **Inject standard IETF rate-limit headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset) into responses.**:
   - Inject standard IETF rate-limit headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset) into responses.

4. **Emit HTTP 429 Too Many Requests with Retry-After headers when quotas are exceeded.**:
   - Emit HTTP 429 Too Many Requests with Retry-After headers when quotas are exceeded.

## Recommended Tools & Environments
- Redis
- Lua Scripting
- Node.js / Python
- Express / FastAPI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
