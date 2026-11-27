---
name: discord-slash-command-interaction-handler
description: Registers and handles Discord slash commands and button components via interaction webhooks. Use when building community and engineering team Discord bots.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://discord.com/developers/docs/interactions/receiving-and-responding"
---
# Discord Slash Command Interaction Handler

## Overview
Modern Discord bots receive interactions via HTTP webhooks rather than persistent gateway websockets, verifying Ed25519 cryptographic signatures and responding with message components.

## Operational Workflow

1. **Validate Ed25519 cryptographic signature (X-Signature-Ed25519, X-Signature-Timestamp).**:
   - Validate Ed25519 cryptographic signature (X-Signature-Ed25519, X-Signature-Timestamp).

2. **Handle PING interaction with immediate PONG response.**:
   - Handle PING interaction with immediate PONG response.

3. **Parse application command names and argument options.**:
   - Parse application command names and argument options.

4. **Respond within 3 seconds with message payload or defer response for long-running tasks.**:
   - Respond within 3 seconds with message payload or defer response for long-running tasks.

## Recommended Tools & Environments
- Discord API
- Ed25519 Signatures
- Interaction Webhooks
- Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
