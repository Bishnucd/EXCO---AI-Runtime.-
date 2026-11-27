---
name: zod-to-json-schema-compiler
description: Compiles TypeScript Zod validation schemas into standardized JSON Schema Draft 2020-12 specifications. Use when exporting type-safe TypeScript interfaces to AI agent tool definitions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/StefanTerdell/zod-to-json-schema"
---
# Zod To Json Schema Compiler

## Overview
TypeScript developers use Zod for runtime type checking. Compiling Zod schemas directly to JSON Schema ensures backend validation logic and agent tool parameter definitions stay perfectly synchronized.

## Operational Workflow

1. **Define type-safe input contracts using Zod objects with .describe() annotations.**:
   - Define type-safe input contracts using Zod objects with .describe() annotations.

2. **Execute zodToJsonSchema(schema, { target**:
   - Execute zodToJsonSchema(schema, { target: "jsonSchema2020-12" }).

3. **Validate generated schema against draft specifications using automated linter suites.**:
   - Validate generated schema against draft specifications using automated linter suites.

4. **Bind compiled JSON schema to agent tool registration manifests.**:
   - Bind compiled JSON schema to agent tool registration manifests.

## Recommended Tools & Environments
- Zod
- zod-to-json-schema
- TypeScript
- JSON Schema

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
