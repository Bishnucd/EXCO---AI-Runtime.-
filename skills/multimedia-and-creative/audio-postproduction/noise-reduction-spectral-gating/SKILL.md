---
name: noise-reduction-spectral-gating
description: Removes stationary background hiss, hum, and fan noise from spoken audio recordings using spectral gating. Use when cleaning vocal dialogue recorded in untreated acoustic environments.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/timsainb/noisereduce"
---
# Noise Reduction Spectral Gating

## Overview
HVAC hum and electrical hiss degrade vocal clarity. Spectral gating captures a noise profile from silent pauses and attenuates those frequencies across the entire recording without muffling speech.

## Operational Workflow

1. **Identify a 1-second segment of background ambient silence within the audio track.**:
   - Identify a 1-second segment of background ambient silence within the audio track.

2. **Compute Fourier transform spectral noise profile of the ambient room noise.**:
   - Compute Fourier transform spectral noise profile of the ambient room noise.

3. **Apply dynamic frequency-domain threshold gating to attenuate noise frequencies across speech segments.**:
   - Apply dynamic frequency-domain threshold gating to attenuate noise frequencies across speech segments.

4. **Fine-tune time-smoothing parameters (attack and release) to prevent robotic watery artifacts.**:
   - Fine-tune time-smoothing parameters (attack and release) to prevent robotic watery artifacts.

## Recommended Tools & Environments
- Python 3.10+
- noisereduce
- SciPy
- WAV Audio

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
