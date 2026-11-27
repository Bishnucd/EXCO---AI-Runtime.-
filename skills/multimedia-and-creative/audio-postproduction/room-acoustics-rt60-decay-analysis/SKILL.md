---
name: room-acoustics-rt60-decay-analysis
description: Measures reverberation time (RT60) and frequency decay curves from room impulse responses. Use when analyzing room acoustics and calibrating voiceover recording booths.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Reverberation#RT60"
---
# Room Acoustics Rt60 Decay Analysis

## Overview
RT60 represents the time required for sound reflections to decay by 60 decibels. Schroeder backward integration calculates frequency-dependent decay times to identify room standing waves.

## Operational Workflow

1. **Record room impulse response using starter pistol, balloon pop, or sine sweep deconvolution.**:
   - Record room impulse response using starter pistol, balloon pop, or sine sweep deconvolution.

2. **Apply octave-band bandpass filters across standard acoustic bands (125Hz to 8kHz).**:
   - Apply octave-band bandpass filters across standard acoustic bands (125Hz to 8kHz).

3. **Compute Schroeder backward integration energy decay curves for each frequency band.**:
   - Compute Schroeder backward integration energy decay curves for each frequency band.

4. **Calculate T20 or T30 slope extrapolation to determine RT60 decay values in seconds.**:
   - Calculate T20 or T30 slope extrapolation to determine RT60 decay values in seconds.

## Recommended Tools & Environments
- RT60 Analysis
- Schroeder Integration
- Python Librosa / Scipy
- Acoustics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
