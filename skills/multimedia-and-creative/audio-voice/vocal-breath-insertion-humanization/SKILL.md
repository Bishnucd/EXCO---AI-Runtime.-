---
name: vocal-breath-insertion-humanization
description: Detects natural breathing pauses and injects organic breath audio samples into synthetic speech streams. Use when eliminating unnatural robotic perfection from AI-generated voiceovers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Speech_synthesis#Humanization"
---
# Vocal Breath Insertion Humanization

## Overview
Real voice actors breathe every 6 to 10 seconds. Synthetic TTS sounds robotic because it lacks respiratory pauses. Injecting subtle, matched breath audio samples makes AI speech indistinguishable from human.

## Operational Workflow

1. **Scan text for major paragraph breaks, question marks, and long complex sentence clauses.**:
   - Scan text for major paragraph breaks, question marks, and long complex sentence clauses.

2. **Insert 150ms–250ms silence intervals at natural respiratory pause locations.**:
   - Insert 150ms–250ms silence intervals at natural respiratory pause locations.

3. **Select pitch-matched human inhalation audio sample corresponding to speaker age and gender.**:
   - Select pitch-matched human inhalation audio sample corresponding to speaker age and gender.

4. **Crossfade breath sample into the silence gap at -24dB relative to speech volume for subtlety.**:
   - Crossfade breath sample into the silence gap at -24dB relative to speech volume for subtlety.

## Recommended Tools & Environments
- Voice Humanization
- Breath Insertion
- Audio Blending
- TTS Post-Processing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
