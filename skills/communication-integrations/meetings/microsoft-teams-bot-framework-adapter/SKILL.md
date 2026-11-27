---
name: microsoft-teams-bot-framework-adapter
description: Builds interactive Microsoft Teams bot adapters using the Microsoft Bot Framework SDK. Use when deploying conversational assistants and adaptive cards to Microsoft Teams.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://learn.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots"
---
# Microsoft Teams Bot Framework Adapter

## Overview
Microsoft Teams bots interact via the Azure Bot Service, processing activity turns, rendering rich interactive Adaptive Cards, and managing 1:1 and channel conversational state.

## Operational Workflow

1. **Register bot in Azure Bot Framework portal and configure Microsoft Teams channel.**:
   - Register bot in Azure Bot Framework portal and configure Microsoft Teams channel.

2. **Implement TeamsActivityHandler processing message, mention, and action events.**:
   - Implement TeamsActivityHandler processing message, mention, and action events.

3. **Construct interactive Adaptive Card JSON with input controls and action submit buttons.**:
   - Construct interactive Adaptive Card JSON with input controls and action submit buttons.

4. **Handle card submit events and update card state in-place without cluttering channel history.**:
   - Handle card submit events and update card state in-place without cluttering channel history.

## Recommended Tools & Environments
- Microsoft Bot Framework
- Teams SDK
- Adaptive Cards
- C# / TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
