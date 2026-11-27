---
name: slack-block-kit-interactive-bot-webhook
description: Constructs interactive Slack Block Kit modals and handles interactive action payload webhooks. Use when building workflow automation bots and interactive Slack notifications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://api.slack.com/block-kit"
---
# Slack Block Kit Interactive Bot Webhook

## Overview
Slack Block Kit enables rich interactive UI in chat, including dropdowns, datepickers, buttons, and modal dialogs. Bolt framework simplifies responding to interactive action payloads.

## Operational Workflow

1. **Design interactive message payload using Slack Block Kit Builder (section, actions, button).**:
   - Design interactive message payload using Slack Block Kit Builder (section, actions, button).

2. **Send formatted JSON blocks to incoming webhook URL or via chat.postMessage API.**:
   - Send formatted JSON blocks to incoming webhook URL or via chat.postMessage API.

3. **Listen for interactive payloads on action URL, verifying Slack request signature (x-slack-signature).**:
   - Listen for interactive payloads on action URL, verifying Slack request signature (x-slack-signature).

4. **Acknowledge request within 3 seconds and update original message or open interactive modal dialog.**:
   - Acknowledge request within 3 seconds and update original message or open interactive modal dialog.

## Recommended Tools & Environments
- Slack Block Kit
- Bolt SDK
- Webhooks
- ChatOps

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
