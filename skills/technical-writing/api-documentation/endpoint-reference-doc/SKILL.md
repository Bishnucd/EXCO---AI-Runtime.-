---
name: endpoint-reference-doc
description: Drafts clear, comprehensive API endpoint reference documentation with request/response examples, authentication details, parameter tables, and common error scenarios. Use when documenting RESTful endpoints for public or internal developer portals.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/style"
---

# Endpoint Reference Doc

## Overview
High-quality developer documentation accelerates API adoption and reduces developer support requests. This skill provides instructions for generating developer-friendly API endpoint documentation with structured parameter specifications, real-world curl and language code samples, response payload schemas, and explicit troubleshooting guidance.

## Operational Workflow

1. **Endpoint Overview & URI Pattern**:
   - Provide concise one-sentence description of the endpoint's purpose.
   - Display HTTP method badge and resource path (e.g., `POST /v1/webhooks/subscriptions`).
   - Specify required authentication scopes (e.g. `Bearer Token (Scope: webhooks:write)`).

2. **Parameter and Payload Specification**:
   - Create Markdown tables documenting:
     - **Path Parameters**: Name, type, required status, and description.
     - **Query Parameters**: Optional filters, pagination controls (`limit`, `cursor`), sort orders.
     - **Request Headers**: Custom headers (`Idempotency-Key`, `Content-Type`).
     - **Request Body**: Detailed attribute descriptions, formats, constraints, and defaults.

3. **Multi-Language Request Examples**:
   - Provide copy-paste ready request snippets in standard formats:
     - cURL command with authentic flags and placeholder values.
     - Node.js (Fetch / Axios).
     - Python (Requests / httpx).

4. **Response Payload Documentation**:
   - Display standard 200/201 response JSON with realistic data (avoid meaningless `"string"` or `"foo"` dummy values).
   - Document error scenarios with status codes (400, 401, 403, 404, 429) and corresponding RFC 7807 error responses.

5. **Best Practices and Caveats**:
   - Detail rate limits and tier quotas.
   - Document idempotency semantics and retry guidance for transient network failures.
