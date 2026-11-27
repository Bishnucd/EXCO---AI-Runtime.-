---
name: json-schema-dereferencer
description: Resolves and bundles remote, local, and circular $ref references in JSON Schema specifications. Use when compiling complex, modular schemas for agent tool parameter validation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/APIDevTools/json-schema-ref-parser"
---
# Json Schema Dereferencer

## Overview
Complex schemas split across multiple files or sharing common definition models rely on $ref pointers. Resolving and dereferencing schemas into self-contained objects is essential for LLM tool calling.

## Operational Workflow

1. **Load entrypoint JSON or YAML schema file containing external or internal $ref tags.**:
   - Load entrypoint JSON or YAML schema file containing external or internal $ref tags.

2. **Parse schema using $RefParser.dereference to fetch and inline referenced schemas.**:
   - Parse schema using $RefParser.dereference to fetch and inline referenced schemas.

3. **Detect and safely handle circular schema references using depth limits.**:
   - Detect and safely handle circular schema references using depth limits.

4. **Output bundled, self-contained schema ready for tool parameter registration.**:
   - Output bundled, self-contained schema ready for tool parameter registration.

## Recommended Tools & Environments
- @apidevtools/json-schema-ref-parser
- Node.js
- JSON Schema
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
