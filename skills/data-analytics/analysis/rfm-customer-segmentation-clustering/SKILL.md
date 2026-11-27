---
name: rfm-customer-segmentation-clustering
description: Segments customers into behavioral personas using Recency, Frequency, Monetary (RFM) quintile scoring and K-Means. Use when tailoring marketing campaigns to customer lifecycle stages.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/scikit-learn/scikit-learn"
---
# Rfm Customer Segmentation Clustering

## Overview
RFM analysis groups customers based on how recently they purchased, how often they purchase, and how much they spend, segmenting customers into Champions, Loyal, At-Risk, and Hibernating tiers.

## Operational Workflow

1. **Compute Recency (days since last purchase), Frequency (orders count), and Monetary (total spend) per customer.**:
   - Compute Recency (days since last purchase), Frequency (orders count), and Monetary (total spend) per customer.

2. **Assign quintile scores (1 to 5) across R, F, and M dimensions using statistical quantiles.**:
   - Assign quintile scores (1 to 5) across R, F, and M dimensions using statistical quantiles.

3. **Apply K-Means clustering on standardized RFM vectors to discover natural behavioral groupings.**:
   - Apply K-Means clustering on standardized RFM vectors to discover natural behavioral groupings.

4. **Map clusters to strategic marketing playbooks (win-back campaigns, loyalty VIP perks).**:
   - Map clusters to strategic marketing playbooks (win-back campaigns, loyalty VIP perks).

## Recommended Tools & Environments
- Scikit-Learn
- Pandas
- K-Means Clustering
- RFM Scoring

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
