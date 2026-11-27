---
name: market-basket-apriori-association-mining
description: Discovers frequent itemsets and association rules (Support, Confidence, Lift) using the Apriori and FP-Growth algorithms. Use when building cross-selling product recommendation engines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/apriori/"
---
# Market Basket Apriori Association Mining

## Overview
Retailers need to discover what products are purchased together. Association rule mining computes Support, Confidence, and Lift metrics to surface strong purchasing rules (e.g. {Bread, Butter} -> {Milk}).

## Operational Workflow

1. **Transform transaction records into one-hot encoded binary transaction matrix.**:
   - Transform transaction records into one-hot encoded binary transaction matrix.

2. **Run fpgrowth or apriori to identify frequent itemsets exceeding minimum support threshold.**:
   - Run fpgrowth or apriori to identify frequent itemsets exceeding minimum support threshold.

3. **Generate association rules filtering for high confidence (> 60%) and lift (> 1.5).**:
   - Generate association rules filtering for high confidence (> 60%) and lift (> 1.5).

4. **Format top rules into actionable product bundle recommendations.**:
   - Format top rules into actionable product bundle recommendations.

## Recommended Tools & Environments
- mlxtend
- Python 3.10+
- FP-Growth / Apriori
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
