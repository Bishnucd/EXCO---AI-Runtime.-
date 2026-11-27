---
name: cohort-retention-analysis-sql
description: Calculates user acquisition cohort retention curves and churn rates using SQL window functions. Use when analyzing user engagement, product stickiness, and customer lifetime value.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://mode.com/sql-tutorial/sql-retention/"
---
# Cohort Retention Analysis Sql

## Overview
Cohort retention groups users by their acquisition date and tracks subsequent activity over days, weeks, or months to determine product-market fit and retention plateaus.

## Operational Workflow

1. **Segment users into discrete weekly or monthly acquisition cohorts based on first-activity timestamp.**:
   - Segment users into discrete weekly or monthly acquisition cohorts based on first-activity timestamp.

2. **Join activity event logs to calculate elapsed periods between first activity and recurring sessions.**:
   - Join activity event logs to calculate elapsed periods between first activity and recurring sessions.

3. **Aggregate cohort size and calculate retention percentages for periods 0 through N.**:
   - Aggregate cohort size and calculate retention percentages for periods 0 through N.

4. **Format output into triangular cohort heatmaps and identify retention stabilizing baselines.**:
   - Format output into triangular cohort heatmaps and identify retention stabilizing baselines.

## Recommended Tools & Environments
- SQL (Postgres, BigQuery, Snowflake)
- Pandas
- Window Functions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
