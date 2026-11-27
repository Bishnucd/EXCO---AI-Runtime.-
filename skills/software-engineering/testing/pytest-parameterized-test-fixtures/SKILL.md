---
name: pytest-parameterized-test-fixtures
description: Writes DRY, expressive parameterized tests across complex input-output matrices using Pytest fixtures. Use when testing algorithms with diverse data scenarios without code duplication.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.pytest.org/en/stable/how-to/parametrize.html"
---
# Pytest Parameterized Test Fixtures

## Overview
Writing separate test functions for every input variant creates massive code duplication. @pytest.mark.parametrize runs a single test function across a matrix of input-output tuples.

## Operational Workflow

1. **Define parameterized input matrix**:
   - Define parameterized input matrix: @pytest.mark.parametrize("input_val,expected", [(1, True), (0, False), (-1, False)]).

2. **Implement test function asserting that function_under_test(input_val) == expected.**:
   - Implement test function asserting that function_under_test(input_val) == expected.

3. **Combine with modular pytest fixtures for database connections and mock service setup.**:
   - Combine with modular pytest fixtures for database connections and mock service setup.

4. **Execute pytest -v to see individual pass/fail statuses for every parameterized iteration.**:
   - Execute pytest -v to see individual pass/fail statuses for every parameterized iteration.

## Recommended Tools & Environments
- Pytest
- Parameterized Testing
- Fixtures
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
