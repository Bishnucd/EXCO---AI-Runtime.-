---
name: multitrack-audio-stem-mixing
description: Mixes multi-track spoken dialogue stems with background music ducking and sidechain compression. Use when producing professional podcasts, audiobooks, and video soundtracks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://sox.sourceforge.net/sox.html"
---
# Multitrack Audio Stem Mixing

## Overview
Multi-speaker shows require separate EQ, level balancing, and automatic music ducking (lowering music volume when speech is present) to ensure speech remains distinct and intelligible.

## Operational Workflow

1. **Align all participant vocal tracks to a common starting timecode.**:
   - Align all participant vocal tracks to a common starting timecode.

2. **Apply high-pass filtering (80Hz cut) to eliminate low-frequency microphone handling thumps.**:
   - Apply high-pass filtering (80Hz cut) to eliminate low-frequency microphone handling thumps.

3. **Apply sidechain ducking filter to background music track triggered by vocal presence.**:
   - Apply sidechain ducking filter to background music track triggered by vocal presence.

4. **Render final master stereo mix and export in uncompressed WAV and compressed MP3 formats.**:
   - Render final master stereo mix and export in uncompressed WAV and compressed MP3 formats.

## Recommended Tools & Environments
- SoX
- FFmpeg
- Audio Mixing
- Sidechain Compression

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
