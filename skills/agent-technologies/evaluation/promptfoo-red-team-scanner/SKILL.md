---
name: promptfoo-red-team-scanner
description: Runs automated adversarial penetration and red-teaming scans against LLM applications using promptfoo. Use when scanning agent interfaces for prompt injection and jailbreak vulnerabilities.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/promptfoo/promptfoo"
---
# Promptfoo Red Team Scanner

## Overview
promptfoo is a battle-tested CLI tool for evaluating LLM outputs and red-teaming against OWASP Top 10 vulnerabilities, harmful content, and prompt injection attempts.

## Operational Workflow

1. **Configure promptfooconfig.yaml specifying test targets, prompts, and evaluation assertions.**:
   - Configure promptfooconfig.yaml specifying test targets, prompts, and evaluation assertions.

2. **Select red-team plugin suites**:
   - Select red-team plugin suites: prompt-injection, sql-injection, pii-leakage, and jailbreaks.

3. **Execute promptfoo redteam run against staging agent API endpoints.**:
   - Execute promptfoo redteam run against staging agent API endpoints.

4. **Export interactive HTML report visualizing vulnerability scorecards and pass/fail matrices.**:
   - Export interactive HTML report visualizing vulnerability scorecards and pass/fail matrices.

## Recommended Tools & Environments
- promptfoo CLI
- Node.js
- OWASP LLM Top 10
- YAML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
