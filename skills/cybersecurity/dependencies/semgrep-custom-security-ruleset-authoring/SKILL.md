---
name: semgrep-custom-security-ruleset-authoring
description: Authors custom semantic static analysis rules using Semgrep to detect dangerous code patterns and vulnerable APIs. Use when enforcing organization-specific security guardrails in codebases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://semgrep.dev/docs/writing-rules/overview/"
---
# Semgrep Custom Security Ruleset Authoring

## Overview
Regex search produces false positives because it ignores code syntax. Semgrep searches abstract syntax trees, allowing developers to author rules matching dangerous patterns (e.g. exec(user_input)).

## Operational Workflow

1. **Author semgrep rule YAML specifying pattern, pattern-inside, and message.**:
   - Author semgrep rule YAML specifying pattern, pattern-inside, and message.

2. **Use metavariables ($VAR) to track tainted user inputs into dangerous function sinks.**:
   - Use metavariables ($VAR) to track tainted user inputs into dangerous function sinks.

3. **Execute semgrep --config=rules.yaml --error to scan local codebase in CI.**:
   - Execute semgrep --config=rules.yaml --error to scan local codebase in CI.

4. **Provide concrete fix suggestions and link to internal security remediation documentation.**:
   - Provide concrete fix suggestions and link to internal security remediation documentation.

## Recommended Tools & Environments
- Semgrep CLI
- AST Matching
- YAML
- SAST

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
