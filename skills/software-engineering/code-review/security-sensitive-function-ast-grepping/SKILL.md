---
name: security-sensitive-function-ast-grepping
description: Scans pull requests for dangerous sink functions (eval, exec, dangerouslySetInnerHTML) via Semgrep. Use when establishing automated guardrails against dangerous language APIs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://semgrep.dev/docs/"
---
# Security Sensitive Function Ast Grepping

## Overview
Regex grep misses code context. Semgrep understands programming language ASTs, allowing security teams to write lightweight rules that catch dangerous sinks regardless of whitespace or line wraps.

## Operational Workflow

1. **Author Semgrep YAML rule targeting dangerous sinks (e.g., child_process.exec($CMD) or dangerouslySetInnerHTML).**:
   - Author Semgrep YAML rule targeting dangerous sinks (e.g., child_process.exec($CMD) or dangerouslySetInnerHTML).

2. **Configure rule severity (ERROR) and clear remediation advice message for developers.**:
   - Configure rule severity (ERROR) and clear remediation advice message for developers.

3. **Run semgrep ci within pull request workflow.**:
   - Run semgrep ci within pull request workflow.

4. **Block pull request merges automatically if dangerous un-sanitized sink invocations are introduced.**:
   - Block pull request merges automatically if dangerous un-sanitized sink invocations are introduced.

## Recommended Tools & Environments
- Semgrep
- AST Pattern Matching
- Static Analysis
- AppSec

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
