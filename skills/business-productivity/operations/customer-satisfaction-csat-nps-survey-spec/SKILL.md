---
name: customer-satisfaction-csat-nps-survey-spec
description: Designs transactional Customer Satisfaction (CSAT) and Net Promoter Score (NPS) survey programs with closed-loop follow-up. Use when measuring customer sentiment and retention drivers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.bain.com/consulting-services/customer-strategy-and-marketing/net-promoter-score-system/"
---
# Customer Satisfaction Csat Nps Survey Spec

## Overview
Measuring customer sentiment requires structured survey cadences. Combining transactional CSAT after support interactions with periodic relationship NPS measures loyalty and uncovers churn risks.

## Operational Workflow

1. **Configure transactional CSAT trigger following resolved customer support ticket events.**:
   - Configure transactional CSAT trigger following resolved customer support ticket events.

2. **Schedule quarterly NPS survey pulses (0-10 "How likely are you to recommend...") to active users.**:
   - Schedule quarterly NPS survey pulses (0-10 "How likely are you to recommend...") to active users.

3. **Calculate NPS = % Promoters (9-10) - % Detractors (0-6).**:
   - Calculate NPS = % Promoters (9-10) - % Detractors (0-6).

4. **Trigger automated closed-loop alerts directing customer success managers to contact detractors within 24h.**:
   - Trigger automated closed-loop alerts directing customer success managers to contact detractors within 24h.

## Recommended Tools & Environments
- Bain NPS System
- CSAT / CES
- Survey Design
- Analytics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
