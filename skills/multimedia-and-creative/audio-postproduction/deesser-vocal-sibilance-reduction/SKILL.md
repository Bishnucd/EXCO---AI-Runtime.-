---
name: deesser-vocal-sibilance-reduction
description: Attenuates harsh vocal sibilance frequencies (5kHz–8kHz) using dynamic band-split de-essing filters. Use when smoothing piercing vocal recordings for podcasts and voiceovers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/De-essing"
---
# Deesser Vocal Sibilance Reduction

## Overview
Sibilant consonants ("s", "z", "sh") create piercing high-frequency spikes. De-essers isolate high frequencies with sidechain bandpass filters and compress them dynamically above a threshold.

## Operational Workflow

1. **Identify center sibilance frequency (typically 5.5kHz to 7.5kHz for male/female voices).**:
   - Identify center sibilance frequency (typically 5.5kHz to 7.5kHz for male/female voices).

2. **Configure sidechain bandpass filter with narrow Q factor centered on detected frequency.**:
   - Configure sidechain bandpass filter with narrow Q factor centered on detected frequency.

3. **Set dynamic gain reduction threshold so only harsh sibilant spikes trigger compression.**:
   - Set dynamic gain reduction threshold so only harsh sibilant spikes trigger compression.

4. **Verify vocal clarity remains natural without lisping or dulled high-end presence.**:
   - Verify vocal clarity remains natural without lisping or dulled high-end presence.

## Recommended Tools & Environments
- De-Esser
- Dynamic EQ
- Audio DSP
- FFmpeg / SoX / Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
