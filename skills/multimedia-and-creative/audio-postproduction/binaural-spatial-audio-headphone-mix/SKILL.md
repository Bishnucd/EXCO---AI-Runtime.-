---
name: binaural-spatial-audio-headphone-mix
description: Renders 3D spatial audio positioning for standard stereo headphones using Head-Related Transfer Functions (HRTF). Use when creating immersive podcast dramas and VR audio experiences.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#sofalizer"
---
# Binaural Spatial Audio Headphone Mix

## Overview
Binaural rendering filters audio through HRTF models that mimic human ear shape, head shadow, and interaural time delays, creating the illusion of 3D audio positioned in physical space.

## Operational Workflow

1. **Load standardized SOFA (Spatially Oriented Format for Acoustics) HRTF impulse response dataset.**:
   - Load standardized SOFA (Spatially Oriented Format for Acoustics) HRTF impulse response dataset.

2. **Specify 3D spherical coordinates (azimuth, elevation, distance) for each sound emitter.**:
   - Specify 3D spherical coordinates (azimuth, elevation, distance) for each sound emitter.

3. **Filter multichannel or ambisonic audio using FFmpeg sofalizer filter with selected SOFA profile.**:
   - Filter multichannel or ambisonic audio using FFmpeg sofalizer filter with selected SOFA profile.

4. **Export stereo binaural audio file optimized for immersive headphone listening.**:
   - Export stereo binaural audio file optimized for immersive headphone listening.

## Recommended Tools & Environments
- Binaural Audio
- HRTF / SOFA Models
- FFmpeg sofalizer
- Spatial Audio

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
