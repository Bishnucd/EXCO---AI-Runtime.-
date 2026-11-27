---
name: time-scale-modification-phase-vocoder
description: Stretches or compresses audio duration without altering pitch using phase vocoder time-scale modification. Use when fitting voiceover tracks into fixed broadcast advertising time slots.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Phase_vocoder"
---
# Time Scale Modification Phase Vocoder

## Overview
Speeding up audio by resampling raises pitch into "chipmunk" frequencies. Phase vocoders calculate Short-Time Fourier Transforms (STFT), stretching time frames while preserving exact spectral pitch.

## Operational Workflow

1. **Calculate required time stretch ratio (e.g., compressing 33-second voiceover to fit 30-second slot**:
   - Calculate required time stretch ratio (e.g., compressing 33-second voiceover to fit 30-second slot: 0.909x).

2. **Compute STFT phase propagation to ensure phase consistency across consecutive analysis windows.**:
   - Compute STFT phase propagation to ensure phase consistency across consecutive analysis windows.

3. **Synthesize time-modified audio using Inverse STFT with overlap-add reconstruction.**:
   - Synthesize time-modified audio using Inverse STFT with overlap-add reconstruction.

4. **Verify that vocal formants and pitch remain completely natural without robotic phasing artifacts.**:
   - Verify that vocal formants and pitch remain completely natural without robotic phasing artifacts.

## Recommended Tools & Environments
- Phase Vocoder
- Time-Scale Modification (TSM)
- Rubberband / SoX
- DSP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
