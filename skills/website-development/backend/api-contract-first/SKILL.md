---
name: api-contract-first
description: Writes an OpenAPI 3.1 contract before any handler code, covering resources, error shapes, pagination, idempotency, and auth, then derives types and contract tests from it. Use when adding a web API, changing an existing endpoint, or when client and server teams need an agreed interface before implementation.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# API Contract First

The contract is the design. Handlers are written to satisfy it, and tests are generated
from it. This prevents the usual failure where the client is built against a guessed
response shape.

## When to use

- A new endpoint or resource.
- A breaking change to an existing endpoint.
- Two teams or two agents building client and server separately.
- Generating typed clients.

Not for internal function signatures — this is for HTTP boundaries.

## Workflow

### 1. Pin the conventions before writing paths

Decide and write down, in the contract description:

| Decision | Default if the user has none |
|----------|------------------------------|
| Base path | `/v1` |
| IDs | Opaque strings, not sequential integers |
| Timestamps | RFC 3339 UTC, `Z` suffix |
| Field naming | `snake_case` (or match the existing codebase exactly) |
| Money | Integer minor units plus a currency code, never floats |
| Null vs absent | Document which one means "no value"; be consistent |

### 2. Model resources, not screens

Define schemas once under `components.schemas` and reference them. A resource has:

- `id` (read-only)
- creation/update timestamps (read-only)
- its own fields
- relationships as IDs, not nested objects, unless the client always needs them

### 3. Define the error envelope

Use one shape everywhere:

```yaml
Error:
  type: object
  required: [error]
  properties:
    error:
      type: object
      required: [code, message]
      properties:
        code: { type: string, example: "validation_failed" }
        message: { type: string }
        details:
          type: array
          items:
            type: object
            properties:
              field: { type: string }
              issue: { type: string }
        request_id: { type: string }
```

Document every status code the endpoint can return, including 401, 403, 404, 409, 422, 429,
and 500. An undocumented status is a bug.

### 4. Decide the cross-cutting behaviour

- **Pagination:** cursor-based by default. `?limit=&cursor=` returning
  `{ data: [], next_cursor: string|null }`. Offset pagination only when the user needs page
  numbers; then document the instability under concurrent writes.
- **Filtering and sorting:** whitelist the allowed fields in the contract. Never pass a raw
  field name from the client to a query.
- **Idempotency:** mutating endpoints that a client may retry accept an
  `Idempotency-Key` header. Document the replay window and what a replay returns.
- **Auth:** state the scheme per operation with `security`. Note scopes.
- **Rate limits:** document the headers returned (`RateLimit-Limit`, `RateLimit-Remaining`,
  `Retry-After`).
- **Concurrency:** `ETag` plus `If-Match` for updates that can conflict.

### 5. Write the contract, then lint it

Produce `openapi.yaml`. Validate with a linter (Spectral or Redocly) and fix all errors.
Common defects to check by hand:

- Every `$ref` resolves.
- Every operation has a unique `operationId` in verb-noun form (`listInvoices`).
- Every response has a schema; no bare `description`-only responses.
- No `additionalProperties: true` on request bodies without a stated reason.

### 6. Derive artefacts

- TypeScript types via `openapi-typescript`.
- A typed client via `openapi-fetch` or the generator the project already uses.
- Contract tests: one test per operation that asserts status codes and schema conformance
  against a running server.

### 7. Implement and verify

Write handlers against the contract. Run contract tests. Any deviation is a contract change
and must go back through step 1.

## Rules

- Never invent a field in the handler that is not in the contract.
- Never return a different shape on error than the error envelope.
- Do not version by mutating `/v1` in a breaking way; add `/v2` or make the change additive.
- Do not expose internal identifiers (database primary keys, stack traces) in responses.
- Every example in the contract must be valid against its own schema.

## Output format

```
openapi.yaml          # the contract
CONTRACT_NOTES.md     # conventions, decisions, open questions
types/api.d.ts        # generated
tests/contract/*.test.ts
```

`CONTRACT_NOTES.md` must list every decision from step 1 with the chosen value, so a later
reader does not have to reverse-engineer the conventions.

## Error handling

| Condition | Action |
|-----------|--------|
| Existing API has no contract | Derive one from real responses, mark it `x-derived: true`, and list every guess |
| Client needs a field the domain cannot provide | Record it as an open question; do not add a fake field |
| Breaking change is unavoidable | Write the migration note: old shape, new shape, deprecation window |

## Example

**Input:** "Add invoice endpoints."
**Output:** `openapi.yaml` with `listInvoices`, `getInvoice`, `createInvoice`,
`voidInvoice`; cursor pagination; `Idempotency-Key` on create; `409` for voiding an already
voided invoice; generated types; four contract tests.
