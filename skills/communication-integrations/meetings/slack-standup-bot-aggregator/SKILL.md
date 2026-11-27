---
name: slack-standup-bot-aggregator
description: Collects asynchronous team daily standup updates via interactive Slack modals and posts aggregated team summaries. Use when running asynchronous agile standup workflows in Slack.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://api.slack.com/block-kit"
---
# Slack Standup Bot Aggregator

## Overview
Asynchronous standups eliminate scheduling friction across timezones. A Slack bot prompts team members with standard agile prompts and publishes a tidy, summarized digest.

## Operational Workflow

1. **Trigger scheduled Slack reminders prompting team members to open standup modals.**:
   - Trigger scheduled Slack reminders prompting team members to open standup modals.

2. **Collect standard inputs**:
   - Collect standard inputs: yesterday accomplishments, today goals, and blockers.

3. **Aggregate individual responses into a clean Slack Block Kit layout.**:
   - Aggregate individual responses into a clean Slack Block Kit layout.

4. **Post compiled daily team standup report to designated team channels with highlight badges for blockers.**:
   - Post compiled daily team standup report to designated team channels with highlight badges for blockers.

## Recommended Tools & Environments
- Slack Bolt SDK
- Block Kit
- Node.js / Python
- Redis

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
