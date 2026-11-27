---
name: skill-input-schema-validation
description: Defines and validates rigorous JSON Schema specifications for agent tool parameters and skill invocations. Use when authoring tool interfaces to guarantee deterministic parameter passing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://json-schema.org/draft/2020-12/release-notes"
---
# Skill Input Schema Validation

## Overview
Agent skills fail silently or hallucinate arguments when parameter boundaries are ambiguous. Formal JSON Schema definitions with strict typing and regex constraints ensure reliable model calling.

## Operational Workflow

1. **Declare parameter types, default values, and enum sets in strict Draft 2020-12 JSON Schema format.**:
   - Declare parameter types, default values, and enum sets in strict Draft 2020-12 JSON Schema format.

2. **Add human-readable descriptions containing unambiguous formatting examples and unit constraints.**:
   - Add human-readable descriptions containing unambiguous formatting examples and unit constraints.

3. **Set additionalProperties**:
   - Set additionalProperties: false to prevent language models from fabricating extra arguments.

4. **Compile and validate schema files against test fixtures using automated validators.**:
   - Compile and validate schema files against test fixtures using automated validators.

## Recommended Tools & Environments
- JSON Schema 2020-12
- Pydantic V2
- Ajv
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
