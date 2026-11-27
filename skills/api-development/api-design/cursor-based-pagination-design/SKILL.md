---
name: cursor-based-pagination-design
description: Designs opaque cursor-based API pagination using base64-encoded record pointers and limit bounds. Use when paginating high-velocity or real-time datasets without page-drift bugs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://slack.engineering/evolving-api-pagination-at-slack/"
---
# Cursor Based Pagination Design

## Overview
Offset-based pagination (page=5) degrades linearly on large tables and skips or duplicates records when new items are inserted. Cursor pagination uses stable indexed pointers for O(1) performance.

## Operational Workflow

1. **Select immutable sort key (e.g. created_at, id) covered by composite database index.**:
   - Select immutable sort key (e.g. created_at, id) covered by composite database index.

2. **Encode pointer value and direction into opaque base64 cursor strings (e.g. next_cursor).**:
   - Encode pointer value and direction into opaque base64 cursor strings (e.g. next_cursor).

3. **Construct database query filtering WHERE (created_at, id) < (cursor_time, cursor_id) LIMIT N+1.**:
   - Construct database query filtering WHERE (created_at, id) < (cursor_time, cursor_id) LIMIT N+1.

4. **Return response envelope with has_more boolean flag and next_cursor token.**:
   - Return response envelope with has_more boolean flag and next_cursor token.

## Recommended Tools & Environments
- SQL Window Functions
- Base64
- REST
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
