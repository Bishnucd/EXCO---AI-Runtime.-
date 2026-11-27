---
name: ffmpeg-loudness-normalization-lufs
description: Normalizes audio loudness to standard broadcast targets (-16 LUFS podcast, -14 LUFS streaming) via FFmpeg loudnorm filter. Use when mastering spoken audio for podcast or streaming distribution.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#loudnorm"
---
# Ffmpeg Loudness Normalization Lufs

## Overview
Inconsistent audio loudness annoys listeners and causes platforms to apply jarring automatic gain control. FFmpeg two-pass loudnorm ensures audio strictly meets EBU R128 podcast standards.

## Operational Workflow

1. **Pass 1**:
   - Pass 1: Analyze source audio file to measure integrated loudness (I), loudness range (LRA), and true peak (TP).

2. **Extract JSON analysis metrics containing measured_I, measured_LRA, and measured_thresh.**:
   - Extract JSON analysis metrics containing measured_I, measured_LRA, and measured_thresh.

3. **Pass 2**:
   - Pass 2: Apply ffmpeg loudnorm filter passing measured values and target parameters (I=-16, TP=-1.5).

4. **Verify that output audio stream adheres to target true-peak and integrated LUFS constraints.**:
   - Verify that output audio stream adheres to target true-peak and integrated LUFS constraints.

## Recommended Tools & Environments
- FFmpeg
- EBU R128
- Bash / PowerShell
- LUFS

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
