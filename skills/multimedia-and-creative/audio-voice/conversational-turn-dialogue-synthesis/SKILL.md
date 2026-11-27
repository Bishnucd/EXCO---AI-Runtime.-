---
name: conversational-turn-dialogue-synthesis
description: Synthesizes natural multi-speaker dialogues with humanlike turn-taking, pauses, and backchannel responses. Use when generating realistic two-person podcast interviews or simulated calls.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Turn-taking"
---
# Conversational Turn Dialogue Synthesis

## Overview
Human conversations involve overlapping acknowledgments ("yeah", "uh-huh"), varying pause gaps, and reactive pitch shifts. Multi-speaker synthesis coordinates timing between distinct voice profiles.

## Operational Workflow

1. **Parse conversational dialogue script annotated with speaker IDs and turn transitions.**:
   - Parse conversational dialogue script annotated with speaker IDs and turn transitions.

2. **Synthesize individual dialogue turns using distinct, matched neural speaker embeddings.**:
   - Synthesize individual dialogue turns using distinct, matched neural speaker embeddings.

3. **Calculate realistic turn-taking transition gaps (150ms–350ms for fluent human conversational flow).**:
   - Calculate realistic turn-taking transition gaps (150ms–350ms for fluent human conversational flow).

4. **Overlay subtle listener backchannel affirmations ("mm-hmm") beneath primary speaker turns.**:
   - Overlay subtle listener backchannel affirmations ("mm-hmm") beneath primary speaker turns.

## Recommended Tools & Environments
- Turn-Taking Synthesis
- Multi-Speaker Audio
- Backchanneling
- Speech Prosody

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
