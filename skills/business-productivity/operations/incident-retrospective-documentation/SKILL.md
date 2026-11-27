---
name: incident-retrospective-documentation
description: Structures blameless incident post-mortem and retrospective reports with root cause analyses (5 Whys). Use when analyzing operational outages to prevent recurrence.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://sre.google/sre-book/postmortem-culture/"
---
# Incident Retrospective Documentation

## Overview
Blameless post-mortems foster operational resilience. A structured retrospective captures incident timeline, user impact, root causes, what went well, what went poorly, and corrective action items.

## Operational Workflow

1. **Compile chronological incident timeline from monitoring alerts, chat logs, and commit histories.**:
   - Compile chronological incident timeline from monitoring alerts, chat logs, and commit histories.

2. **Quantify user impact (outage duration, affected customer percentage, revenue/SLA implications).**:
   - Quantify user impact (outage duration, affected customer percentage, revenue/SLA implications).

3. **Perform 5 Whys and fishbone root-cause analysis focusing on systemic and tooling gaps.**:
   - Perform 5 Whys and fishbone root-cause analysis focusing on systemic and tooling gaps.

4. **Define actionable, prioritized preventive tasks with assigned owners and SLA completion targets.**:
   - Define actionable, prioritized preventive tasks with assigned owners and SLA completion targets.

## Recommended Tools & Environments
- Markdown
- SRE Best Practices
- Jira / Linear
- Git

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
