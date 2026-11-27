---
name: highpass-filter-rumble-attenuation
description: Attenuates sub-audible mechanical rumble, air conditioning hum, and microphone handling noise using steep high-pass filters. Use when cleaning voice tracks prior to compression.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#highpass"
---
# Highpass Filter Rumble Attenuation

## Overview
Frequencies below 80Hz contain HVAC vibrations and handling noise that waste amplifier headroom and trigger compressors prematurely. Steep Butterworth HPFs eliminate sub-bass rumble.

## Operational Workflow

1. **Inspect audio spectrum analyzer to identify frequency range of low-end mechanical noise.**:
   - Inspect audio spectrum analyzer to identify frequency range of low-end mechanical noise.

2. **Configure 18dB/octave or 24dB/octave high-pass filter with cutoff frequency at 80Hz (voice).**:
   - Configure 18dB/octave or 24dB/octave high-pass filter with cutoff frequency at 80Hz (voice).

3. **For female vocals or light dialogue, adjust cutoff upward to 100Hz–110Hz if low warmth permits.**:
   - For female vocals or light dialogue, adjust cutoff upward to 100Hz–110Hz if low warmth permits.

4. **Verify that vocal fullness remains intact while bass rumble and microphone thumps disappear.**:
   - Verify that vocal fullness remains intact while bass rumble and microphone thumps disappear.

## Recommended Tools & Environments
- High-Pass Filter (HPF)
- FFmpeg Audio Filters
- Audio Cleanup
- DSP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
