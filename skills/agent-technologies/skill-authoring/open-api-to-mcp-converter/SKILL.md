---
name: open-api-to-mcp-converter
description: Converts RESTful OpenAPI 3.0/3.1 specifications into Model Context Protocol tool definitions. Use when automatically generating agent tool servers from existing REST APIs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/modelcontextprotocol/servers"
---
# Open Api To Mcp Converter

## Overview
Manually writing MCP tool wrappers for hundreds of API endpoints is tedious. Parsing OpenAPI specs automatically transforms each HTTP path and operation into a registered MCP tool.

## Operational Workflow

1. **Parse OpenAPI 3.1 JSON or YAML specification document.**:
   - Parse OpenAPI 3.1 JSON or YAML specification document.

2. **Map each operationId and path into an MCP tool with matching description and inputSchema.**:
   - Map each operationId and path into an MCP tool with matching description and inputSchema.

3. **Configure dynamic HTTP client executing API requests using baseUrl and auth tokens.**:
   - Configure dynamic HTTP client executing API requests using baseUrl and auth tokens.

4. **Return structured HTTP response body and status codes to the calling agent.**:
   - Return structured HTTP response body and status codes to the calling agent.

## Recommended Tools & Environments
- OpenAPI 3.1
- Node.js
- Model Context Protocol
- Axios

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
