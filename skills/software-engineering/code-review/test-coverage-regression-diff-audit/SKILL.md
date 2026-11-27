---
name: test-coverage-regression-diff-audit
description: Enforces that new lines of code in pull requests meet minimum 80% branch coverage using Codecov diffs. Use when preventing test coverage degradation over time.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.codecov.com/docs/commit-status"
---
# Test Coverage Regression Diff Audit

## Overview
Total project coverage metrics mask regressions because adding 1,000 untested lines only drops overall coverage by 0.5%. Diff coverage measures exclusively the lines changed in the pull request.

## Operational Workflow

1. **Generate LCOV or Cobertura XML test coverage reports during CI test execution.**:
   - Generate LCOV or Cobertura XML test coverage reports during CI test execution.

2. **Upload coverage reports to Codecov or Coveralls with commit SHA and base branch reference.**:
   - Upload coverage reports to Codecov or Coveralls with commit SHA and base branch reference.

3. **Configure patch status check requiring minimum 80% coverage on new/modified code lines.**:
   - Configure patch status check requiring minimum 80% coverage on new/modified code lines.

4. **Review Codecov PR comment to inspect exact uncovered lines and branches before approving.**:
   - Review Codecov PR comment to inspect exact uncovered lines and branches before approving.

## Recommended Tools & Environments
- Codecov
- Diff Coverage
- Branch Coverage
- CI/CD Gate

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
