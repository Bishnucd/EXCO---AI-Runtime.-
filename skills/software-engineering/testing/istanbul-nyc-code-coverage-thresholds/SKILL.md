---
name: istanbul-nyc-code-coverage-thresholds
description: Measures line, branch, and statement test coverage and enforces CI thresholds with NYC/Istanbul. Use when setting automated code coverage minimums across JavaScript test suites.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://istanbul.js.org/"
---
# Istanbul Nyc Code Coverage Thresholds

## Overview
Istanbul instruments JavaScript source code with execution counters, generating detailed HTML and terminal coverage reports that measure line, function, statement, and branch coverage.

## Operational Workflow

1. **Configure .nycrc specifying reporters (text, lcov, html) and include/exclude glob patterns.**:
   - Configure .nycrc specifying reporters (text, lcov, html) and include/exclude glob patterns.

2. **Set strict threshold gates**:
   - Set strict threshold gates: { "lines": 80, "statements": 80, "functions": 80, "branches": 75 }.

3. **Run test suite wrapped with nyc**:
   - Run test suite wrapped with nyc: npx nyc mocha tests/.

4. **Exit build with non-zero status code if code coverage falls below declared minimum thresholds.**:
   - Exit build with non-zero status code if code coverage falls below declared minimum thresholds.

## Recommended Tools & Environments
- Istanbul / NYC
- Code Coverage
- CI Thresholds
- JavaScript / Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
