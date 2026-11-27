---
name: sonarqube-quality-gate-threshold-audit
description: Enforces static code analysis, security hotspots, and code smell quality gates with SonarQube in PRs. Use when automating quality gates and preventing technical debt in CI.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.sonarsource.com/sonarqube/latest/user-guide/quality-gates/"
---
# Sonarqube Quality Gate Threshold Audit

## Overview
SonarQube inspects source code pull requests for security vulnerabilities, bugs, and technical debt, blocking merges when new code fails coverage, duplication, or security thresholds.

## Operational Workflow

1. **Configure sonar-project.properties with project keys, source directories, and coverage report paths.**:
   - Configure sonar-project.properties with project keys, source directories, and coverage report paths.

2. **Define Quality Gate rules**:
   - Define Quality Gate rules: 0 new bugs, 0 new vulnerabilities, and >= 80% coverage on new code.

3. **Execute sonar-scanner CLI during pull request CI pipeline execution.**:
   - Execute sonar-scanner CLI during pull request CI pipeline execution.

4. **Enforce automated branch protection blocking PR merges if Quality Gate reports RED.**:
   - Enforce automated branch protection blocking PR merges if Quality Gate reports RED.

## Recommended Tools & Environments
- SonarQube
- Static Code Analysis
- Quality Gates
- CI/CD

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
