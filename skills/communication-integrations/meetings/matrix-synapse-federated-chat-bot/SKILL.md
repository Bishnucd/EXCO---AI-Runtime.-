---
name: matrix-synapse-federated-chat-bot
description: Implements end-to-end encrypted bots on the federated Matrix protocol using matrix-js-sdk or matrix-nio. Use when deploying secure, sovereign communication bots for private networks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://matrix.org/docs/guides/matrix-js-sdk/"
---
# Matrix Synapse Federated Chat Bot

## Overview
The Matrix protocol provides decentralized, federated messaging with mandatory end-to-end encryption. Matrix bots authenticate with homeservers, manage cryptographic keys, and exchange encrypted events.

## Operational Workflow

1. **Initialize Matrix client connecting to self-hosted Synapse or public homeserver.**:
   - Initialize Matrix client connecting to self-hosted Synapse or public homeserver.

2. **Configure cryptographic device keys and initialize Olm/Megolm E2EE state store.**:
   - Configure cryptographic device keys and initialize Olm/Megolm E2EE state store.

3. **Listen for room timeline events (m.room.message) and decrypt message content.**:
   - Listen for room timeline events (m.room.message) and decrypt message content.

4. **Encrypt response text and dispatch encrypted events into the target Matrix room.**:
   - Encrypt response text and dispatch encrypted events into the target Matrix room.

## Recommended Tools & Environments
- Matrix Protocol
- Olm / Megolm E2EE
- Python matrix-nio
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
