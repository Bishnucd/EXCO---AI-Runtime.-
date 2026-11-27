---
name: mcp-resource-template-uri
description: Defines dynamic URI templates (RFC 6570) to expose parameterized data resources to agents via MCP. Use when exposing queryable database records or files to AI agents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://modelcontextprotocol.io/docs/concepts/resources"
---
# Mcp Resource Template Uri

## Overview
Resource templates allow agents to read dynamic, parameterized content (such as customer records or file paths) using structured URI schemes (e.g. postgres://db/customers/{id}).

## Operational Workflow

1. **Declare ResourceTemplate objects with parameterized URI patterns and human descriptions.**:
   - Declare ResourceTemplate objects with parameterized URI patterns and human descriptions.

2. **Implement resource read handlers parsing dynamic path parameters from requested URIs.**:
   - Implement resource read handlers parsing dynamic path parameters from requested URIs.

3. **Fetch and serialize underlying data into text or binary blob payloads with proper MIME types.**:
   - Fetch and serialize underlying data into text or binary blob payloads with proper MIME types.

4. **Emit resource update subscription notifications when underlying data records change.**:
   - Emit resource update subscription notifications when underlying data records change.

## Recommended Tools & Environments
- Model Context Protocol
- RFC 6570 URI Templates
- Zod
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
