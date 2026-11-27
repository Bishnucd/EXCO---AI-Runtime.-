---
name: voiceover-tone-pacing-adaptation
description: Adapts voiceover speaking rate and pause cadence to match target genre pacing (e.g., corporate vs documentary). Use when tailoring voiceover pacing to visual video scene transitions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Speech_tempo"
---
# Voiceover Tone Pacing Adaptation

## Overview
Corporate promos require brisk pacing (150–160 WPM), while meditative documentaries demand deliberate pacing (110–120 WPM). Pacing adaptation calculates syllable density and adjusts cadence.

## Operational Workflow

1. **Calculate words-per-minute (WPM) and syllables-per-second across script paragraphs.**:
   - Calculate words-per-minute (WPM) and syllables-per-second across script paragraphs.

2. **Adjust base speech rate parameter (rate="slow", rate="+15%") in TTS engine.**:
   - Adjust base speech rate parameter (rate="slow", rate="+15%") in TTS engine.

3. **Insert explicit millisecond pause breaks (<break time="500ms"/>) at clause boundaries.**:
   - Insert explicit millisecond pause breaks (<break time="500ms"/>) at clause boundaries.

4. **Align audio section durations to match video scene cut timestamps.**:
   - Align audio section durations to match video scene cut timestamps.

## Recommended Tools & Environments
- Pacing Adaptation
- Syllable Counting
- Prosody Tuning
- Voiceover Direction

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
