---
name: convolution-reverb-impulse-response
description: Simulates realistic physical acoustic spaces by convolving audio signals with acoustic Impulse Responses (IR). Use when matching dialogue to filmed room acoustics in post-production.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Convolution_reverb"
---
# Convolution Reverb Impulse Response

## Overview
Convolution reverb captures the mathematical acoustic signature of real physical spaces (cathedrals, tiled rooms, cars) by multiplying audio signals with recorded impulse responses.

## Operational Workflow

1. **Record or select an appropriate acoustic impulse response (IR) WAV file matching target scene.**:
   - Record or select an appropriate acoustic impulse response (IR) WAV file matching target scene.

2. **Convolve input dry voice track with IR filter using FFmpeg afir filter or Python scipy.signal.fftconvolve.**:
   - Convolve input dry voice track with IR filter using FFmpeg afir filter or Python scipy.signal.fftconvolve.

3. **Adjust wet/dry mix ratio to blend natural direct sound with reflected ambient room reverberation.**:
   - Adjust wet/dry mix ratio to blend natural direct sound with reflected ambient room reverberation.

4. **Apply high-pass and low-pass filtering to reverb tail to eliminate muddy low frequencies.**:
   - Apply high-pass and low-pass filtering to reverb tail to eliminate muddy low frequencies.

## Recommended Tools & Environments
- Convolution Reverb
- Impulse Response (IR)
- FFmpeg afir Filter
- Spatial Audio

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
