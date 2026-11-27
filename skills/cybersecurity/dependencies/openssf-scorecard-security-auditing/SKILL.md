---
name: openssf-scorecard-security-auditing
description: Audits open-source repositories against OpenSSF Scorecard supply chain security criteria (branch protection, pin-dependencies). Use when assessing third-party dependency security posture.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/ossf/scorecard"
---
# Openssf Scorecard Security Auditing

## Overview
OpenSSF Scorecard runs automated checks on open-source repositories, rating security hygiene (branch protection, code reviews, fuzzing, dangerous workflow patterns) on a 0-10 scale.

## Operational Workflow

1. **Run scorecard --repo=github.com/owner/repo to evaluate supply chain security metrics.**:
   - Run scorecard --repo=github.com/owner/repo to evaluate supply chain security metrics.

2. **Analyze check scores**:
   - Analyze check scores: Branch-Protection, Dependency-Update-Tool, Maintained, Pinned-Dependencies.

3. **Flag high-risk dependencies scoring below acceptable threshold (< 6.0).**:
   - Flag high-risk dependencies scoring below acceptable threshold (< 6.0).

4. **Generate automated remediation pull requests pinning unpinned GitHub Actions to commit SHAs.**:
   - Generate automated remediation pull requests pinning unpinned GitHub Actions to commit SHAs.

## Recommended Tools & Environments
- OpenSSF Scorecard
- Supply Chain Security
- SLSA
- GitHub API

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
