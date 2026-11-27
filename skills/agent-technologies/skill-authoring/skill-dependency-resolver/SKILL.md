---
name: skill-dependency-resolver
description: Validates and resolves environment dependencies, binaries, and prerequisite configurations for AI skills. Use when verifying host environment readiness before skill execution.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.npmjs.com/cli/v9"
---
# Skill Dependency Resolver

## Overview
Agent skills frequently require host CLI tools (git, node, docker). A dependency resolver checks prerequisite binaries, versions, and environment variables before tool execution begins.

## Operational Workflow

1. **Declare required system binaries, semantic version ranges, and environment variables in skill metadata.**:
   - Declare required system binaries, semantic version ranges, and environment variables in skill metadata.

2. **Execute non-destructive pre-flight probes (e.g., --version checks) across Windows, Linux, and macOS.**:
   - Execute non-destructive pre-flight probes (e.g., --version checks) across Windows, Linux, and macOS.

3. **Emit structured remediation guidance if a prerequisite binary is missing or out of date.**:
   - Emit structured remediation guidance if a prerequisite binary is missing or out of date.

4. **Cache probe results to prevent redundant shell overhead across subsequent skill invocations.**:
   - Cache probe results to prevent redundant shell overhead across subsequent skill invocations.

## Recommended Tools & Environments
- Bash / PowerShell
- Node.js
- Python venv
- Docker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
