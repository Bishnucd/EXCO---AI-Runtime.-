---
name: multiband-audio-compression-mastering
description: Balances frequency dynamics across low, mid, and high bands using multiband audio compression. Use when mastering podcasts and music to achieve consistent commercial loudness.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#asubcut_002c-asubboost_002c-acompressor"
---
# Multiband Audio Compression Mastering

## Overview
Single-band compressors duck the entire mix when bass peaks occur. Multiband compressors divide the spectrum into isolated frequency bands, controlling dynamics independently.

## Operational Workflow

1. **Split audio spectrum into 3 or 4 discrete bands using crossover filters (e.g., 120Hz, 2.5kHz, 8kHz).**:
   - Split audio spectrum into 3 or 4 discrete bands using crossover filters (e.g., 120Hz, 2.5kHz, 8kHz).

2. **Apply subtle compression to low band to tame erratic bass thumps and proximity effects.**:
   - Apply subtle compression to low band to tame erratic bass thumps and proximity effects.

3. **Control vocal midrange dynamics with moderate ratio (2**:
   - Control vocal midrange dynamics with moderate ratio (2:1 to 3:1) for consistent presence.

4. **Sum processed frequency bands back together and verify overall frequency balance.**:
   - Sum processed frequency bands back together and verify overall frequency balance.

## Recommended Tools & Environments
- Multiband Compressor
- FFmpeg Audio Filters
- Audio Mastering
- DSP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
