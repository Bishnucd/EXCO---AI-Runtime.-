---
name: great-expectations-data-quality-suite
description: Automates data profiling and pipeline assertions using Great Expectations validation suites. Use when preventing bad data, null spikes, and schema drift from entering downstream analytics.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.greatexpectations.io/"
---
# Great Expectations Data Quality Suite

## Overview
Great Expectations enables data engineers to define programmatic unit tests for datasets, asserting column presence, non-null guarantees, range checks, and regex patterns with HTML reports.

## Operational Workflow

1. **Connect Great Expectations Data Context to SQL warehouse or Parquet storage batch.**:
   - Connect Great Expectations Data Context to SQL warehouse or Parquet storage batch.

2. **Author Expectation Suite declaring criteria (expect_column_values_to_not_be_null, expect_table_row_count_to_be_between).**:
   - Author Expectation Suite declaring criteria (expect_column_values_to_not_be_null, expect_table_row_count_to_be_between).

3. **Run checkpoint validation action against incoming pipeline batch.**:
   - Run checkpoint validation action against incoming pipeline batch.

4. **Generate automated Data Docs HTML reports and halt pipeline execution on critical test failures.**:
   - Generate automated Data Docs HTML reports and halt pipeline execution on critical test failures.

## Recommended Tools & Environments
- Great Expectations
- Python
- Data Quality
- CI/CD Pipelines

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
