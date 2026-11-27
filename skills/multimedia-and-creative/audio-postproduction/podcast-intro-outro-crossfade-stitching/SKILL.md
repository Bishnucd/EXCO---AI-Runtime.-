---
name: podcast-intro-outro-crossfade-stitching
description: Assembles podcast episodes automatically with beat-matched music crossfading and loudness normalization. Use when automating podcast publishing pipelines from raw recorded stems.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#acrossfade"
---
# Podcast Intro Outro Crossfade Stitching

## Overview
Publishing podcasts manually requires repetitive stitching of intro music, episode voice, mid-roll sponsor spots, and outro beds. Automated pipelines align stems with smooth crossfades.

## Operational Workflow

1. **Normalize all audio stems (intro, interview, outro) to target integrated loudness (-16 LUFS).**:
   - Normalize all audio stems (intro, interview, outro) to target integrated loudness (-16 LUFS).

2. **Apply FFmpeg acrossfade filter with exponential curve (e.g., 2.5s duration) between intro music and voice.**:
   - Apply FFmpeg acrossfade filter with exponential curve (e.g., 2.5s duration) between intro music and voice.

3. **Insert mid-roll sponsor ad clips at detected pause timestamps with smooth volume transitions.**:
   - Insert mid-roll sponsor ad clips at detected pause timestamps with smooth volume transitions.

4. **Render final stitched episode file and tag with episode ID3 metadata.**:
   - Render final stitched episode file and tag with episode ID3 metadata.

## Recommended Tools & Environments
- Audio Crossfading
- Loudness Normalization
- FFmpeg acrossfade
- Python Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
