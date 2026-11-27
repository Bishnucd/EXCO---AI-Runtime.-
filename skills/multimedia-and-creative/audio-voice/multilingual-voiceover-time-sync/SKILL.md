---
name: multilingual-voiceover-time-sync
description: Aligns translated voiceover audio durations with original video scene cuts and lip movements. Use when localizing video content into multiple languages with synchronized timing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/International/questions/qa-text-expansion"
---
# Multilingual Voiceover Time Sync

## Overview
Translated speech expands or contracts by 15-30% depending on target language (e.g., German expands relative to English). Time synchronization time-stretches audio to match visual video cuts.

## Operational Workflow

1. **Measure exact visual cut durations and speech windows from source video timeline.**:
   - Measure exact visual cut durations and speech windows from source video timeline.

2. **Calculate duration ratio between translated TTS audio track and original video scene.**:
   - Calculate duration ratio between translated TTS audio track and original video scene.

3. **Apply pitch-neutral time-stretching (Rubber Band filter) within acceptable bounds (0.85x - 1.15x).**:
   - Apply pitch-neutral time-stretching (Rubber Band filter) within acceptable bounds (0.85x - 1.15x).

4. **Adjust inter-sentence pause durations to achieve frame-accurate synchronization with screen transitions.**:
   - Adjust inter-sentence pause durations to achieve frame-accurate synchronization with screen transitions.

## Recommended Tools & Environments
- Python
- FFmpeg
- Rubber Band Library
- SRT / VTT

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
