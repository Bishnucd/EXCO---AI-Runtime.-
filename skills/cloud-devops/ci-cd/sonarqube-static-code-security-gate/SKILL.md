---
name: sonarqube-static-code-security-gate
description: Integrates automated static code analysis, security vulnerability scanning, and quality gates in CI using SonarQube. Use when blocking pull requests that introduce security flaws or technical debt.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.sonarsource.com/sonarqube/latest/"
---
# Sonarqube Static Code Security Gate

## Overview
SonarQube inspects source code for security vulnerabilities, bugs, and maintainability issues. Configuring strict Quality Gates in CI automatically blocks merging PRs with critical issues.

## Operational Workflow

1. **Configure sonar-project.properties with projectKey, language sources, and test coverage paths.**:
   - Configure sonar-project.properties with projectKey, language sources, and test coverage paths.

2. **Execute sonar-scanner step in CI following automated test execution.**:
   - Execute sonar-scanner step in CI following automated test execution.

3. **Wait for SonarQube Quality Gate webhook status check to evaluate pass/fail.**:
   - Wait for SonarQube Quality Gate webhook status check to evaluate pass/fail.

4. **Block pull request merges if coverage < 80% or any Security Hotspots remain unreviewed.**:
   - Block pull request merges if coverage < 80% or any Security Hotspots remain unreviewed.

## Recommended Tools & Environments
- SonarQube / SonarCloud
- SonarScanner CLI
- SAST
- GitHub Actions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
