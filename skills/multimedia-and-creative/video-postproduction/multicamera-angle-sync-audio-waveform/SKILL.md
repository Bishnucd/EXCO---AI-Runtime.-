---
name: multicamera-angle-sync-audio-waveform
description: Synchronizes multiple asynchronous camera video angles automatically by cross-correlating camera microphone audio. Use when automating multi-cam video editing preparation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Cross-correlation"
---
# Multicamera Angle Sync Audio Waveform

## Overview
Manually syncing 3 camera angles and an external audio recorder by looking for claps is tedious. Cross-correlating audio waveforms calculates time lag offsets between all files down to millisecond accuracy.

## Operational Workflow

1. **Extract low-bitrate mono audio tracks from all camera video files and external sound recorder.**:
   - Extract low-bitrate mono audio tracks from all camera video files and external sound recorder.

2. **Compute cross-correlation of audio signals using Fast Fourier Transform (scipy.signal.correlate).**:
   - Compute cross-correlation of audio signals using Fast Fourier Transform (scipy.signal.correlate).

3. **Identify cross-correlation peak representing the exact time lag offset between camera A and camera B.**:
   - Identify cross-correlation peak representing the exact time lag offset between camera A and camera B.

4. **Generate multicam XML sequence (FCPXML or EDL) aligning all video tracks to matched time offsets.**:
   - Generate multicam XML sequence (FCPXML or EDL) aligning all video tracks to matched time offsets.

## Recommended Tools & Environments
- Audio Waveform Cross-Correlation
- Multi-Camera Sync
- NumPy / SciPy
- Video Editing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
