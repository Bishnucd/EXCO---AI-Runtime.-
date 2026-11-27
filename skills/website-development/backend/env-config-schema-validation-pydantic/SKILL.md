---
name: env-config-schema-validation-pydantic
description: Validates environment variables and application configurations at startup using Pydantic Settings and Zod. Use when preventing runtime crashes caused by missing configuration variables.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.pydantic.dev/latest/concepts/pydantic_settings/"
---
# Env Config Schema Validation Pydantic

## Overview
Applications crashing in production due to a typo in an environment variable name waste engineering time. Validating configuration schemas at process boot halts startup immediately if variables are missing.

## Operational Workflow

1. **Define Settings class inheriting from pydantic_settings.BaseSettings or Zod schema.**:
   - Define Settings class inheriting from pydantic_settings.BaseSettings or Zod schema.

2. **Declare required environment variables with explicit types (HttpUrl, SecretStr, PositiveInt).**:
   - Declare required environment variables with explicit types (HttpUrl, SecretStr, PositiveInt).

3. **Instantiate settings object during application initialization before opening database connections.**:
   - Instantiate settings object during application initialization before opening database connections.

4. **Fail fast with detailed error output listing all missing or improperly formatted environment variables.**:
   - Fail fast with detailed error output listing all missing or improperly formatted environment variables.

## Recommended Tools & Environments
- Pydantic Settings
- Zod
- Environment Validation
- Fail-Fast

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
