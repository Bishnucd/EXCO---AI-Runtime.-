---
name: w3c-design-tokens-community-group-spec
description: Authors standardized, platform-agnostic design tokens adhering to the W3C Design Tokens Community Group (DTCG) format. Use when creating interoperable design token architectures.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://design-tokens.github.io/community-group/format/"
---
# W3c Design Tokens Community Group Spec

## Overview
The W3C Design Tokens Community Group specifies a standard JSON format using $value, $type, and $description properties, allowing tokens to be shared between Figma, CSS, iOS, and Android.

## Operational Workflow

1. **Structure design tokens into hierarchical JSON files**:
   - Structure design tokens into hierarchical JSON files: color.json, typography.json, spacing.json.

2. **Declare tokens using standard W3C DTCG syntax**:
   - Declare tokens using standard W3C DTCG syntax: { "$type": "color", "$value": "#0066CC", "$description": "Primary brand color" }.

3. **Define token alias references using curly brace syntax**:
   - Define token alias references using curly brace syntax: { "$value": "{color.brand.primary}" }.

4. **Validate token files against official W3C DTCG JSON Schema before automated build transformations.**:
   - Validate token files against official W3C DTCG JSON Schema before automated build transformations.

## Recommended Tools & Environments
- W3C DTCG Format
- Design Tokens
- JSON Schema
- Cross-Platform

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
