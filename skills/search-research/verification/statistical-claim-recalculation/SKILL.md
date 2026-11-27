---
name: statistical-claim-recalculation
description: Recalculates reported statistical metrics (percentages, ratios, p-values) from raw sample data to verify arithmetic accuracy. Use when auditing research findings, financial reports, and survey claims.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.stat.berkeley.edu/~stark/SticiGui/Text/reasoning.htm"
---
# Statistical Claim Recalculation

## Overview
Published reports frequently contain simple arithmetic errors, truncated baselines, or exaggerated percentage increases. Recalculating metrics from raw numbers exposes flawed conclusions.

## Operational Workflow

1. **Extract stated percentage changes, absolute numbers, sample sizes, and denominator baselines.**:
   - Extract stated percentage changes, absolute numbers, sample sizes, and denominator baselines.

2. **Recalculate reported metrics from base values ($((new - old) / old) \times 100$).**:
   - Recalculate reported metrics from base values ($((new - old) / old) \times 100$).

3. **Verify whether reported sample sizes satisfy statistical power requirements for stated conclusions.**:
   - Verify whether reported sample sizes satisfy statistical power requirements for stated conclusions.

4. **Highlight mathematical discrepancies, baseline shifts, and misleading chart axes.**:
   - Highlight mathematical discrepancies, baseline shifts, and misleading chart axes.

## Recommended Tools & Environments
- Python 3.10+
- Pandas
- SciPy
- Mathematical Verification

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
