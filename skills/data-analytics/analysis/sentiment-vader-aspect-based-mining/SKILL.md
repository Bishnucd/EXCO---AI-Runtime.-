---
name: sentiment-vader-aspect-based-mining
description: Extracts aspect-based sentiment scores from customer reviews using VADER and dependency parse trees. Use when isolating sentiment regarding specific product attributes (price, quality, battery).
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/cjhutto/vaderSentiment"
---
# Sentiment Vader Aspect Based Mining

## Overview
Overall review sentiment obscures specific feedback ("Food was delicious, but service was terrible"). Aspect-based sentiment links sentiment adjectives to specific noun targets in customer feedback.

## Operational Workflow

1. **Parse customer review text into grammatical dependency trees using spaCy.**:
   - Parse customer review text into grammatical dependency trees using spaCy.

2. **Identify product aspect noun targets (e.g. "battery", "camera", "shipping").**:
   - Identify product aspect noun targets (e.g. "battery", "camera", "shipping").

3. **Extract modifying adjectives and compute polarity compound scores using VADER lexicon.**:
   - Extract modifying adjectives and compute polarity compound scores using VADER lexicon.

4. **Aggregate sentiment scores by aspect category to benchmark product feature strengths and weaknesses.**:
   - Aggregate sentiment scores by aspect category to benchmark product feature strengths and weaknesses.

## Recommended Tools & Environments
- vaderSentiment
- spaCy
- Aspect-Based Sentiment
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
