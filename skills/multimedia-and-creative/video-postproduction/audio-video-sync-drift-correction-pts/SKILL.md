---
name: audio-video-sync-drift-correction-pts
description: Corrects cumulative audio-video synchronization drift and Presentation Timestamp (PTS) skew using FFmpeg. Use when fixing gradual audio desync in long interview recordings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#asetpts"
---
# Audio Video Sync Drift Correction Pts

## Overview
Clock drift between separate audio recorders and cameras causes audio to drift out of sync by several seconds over a 2-hour shoot. Rescaling audio timestamps restores perfect lip-sync alignment.

## Operational Workflow

1. **Measure exact audio-video desync delta at start and end of recording (e.g., +1.2s drift over 60 min).**:
   - Measure exact audio-video desync delta at start and end of recording (e.g., +1.2s drift over 60 min).

2. **Calculate precise speed adjustment multiplier (e.g., speed_factor = 3600.0 / 3601.2 = 0.999666).**:
   - Calculate precise speed adjustment multiplier (e.g., speed_factor = 3600.0 / 3601.2 = 0.999666).

3. **Apply FFmpeg atempo audio filter to gently stretch or compress audio to match video duration exactly.**:
   - Apply FFmpeg atempo audio filter to gently stretch or compress audio to match video duration exactly.

4. **Reset audio and video PTS timestamps to start at identical zero origins**:
   - Reset audio and video PTS timestamps to start at identical zero origins: asetpts=PTS-STARTPTS.

## Recommended Tools & Environments
- A/V Sync Correction
- PTS Manipulation
- FFmpeg atempo / asetpts
- Video Repair

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
