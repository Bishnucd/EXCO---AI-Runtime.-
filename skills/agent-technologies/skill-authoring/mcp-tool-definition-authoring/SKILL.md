---
name: mcp-tool-definition-authoring
description: Authors standardized Model Context Protocol (MCP) tool, resource, and prompt definitions. Use when designing custom MCP servers to expose tools and context to AI agents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://modelcontextprotocol.io/introduction"
---
# Mcp Tool Definition Authoring

## Overview
The Model Context Protocol establishes an open standard for connecting AI agents to external tools and data sources. Proper server authoring requires structured capability negotiation.

## Operational Workflow

1. **Define tool metadata, input schema using Zod, and operational handlers within the MCP server lifecycle.**:
   - Define tool metadata, input schema using Zod, and operational handlers within the MCP server lifecycle.

2. **Configure transport layer support (stdio for local agent processes, SSE for remote deployment).**:
   - Configure transport layer support (stdio for local agent processes, SSE for remote deployment).

3. **Implement structured error reporting following JSON-RPC 2.0 error code standards.**:
   - Implement structured error reporting following JSON-RPC 2.0 error code standards.

4. **Validate server responsiveness and capability listings using the MCP Inspector tool.**:
   - Validate server responsiveness and capability listings using the MCP Inspector tool.

## Recommended Tools & Environments
- TypeScript
- Model Context Protocol SDK
- Node.js 18+
- Zod

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
