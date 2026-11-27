---
name: audio-peak-limiter-inter-sample-peaks
description: Prevents digital distortion and inter-sample clipping during MP3/AAC encoding using True Peak brickwall limiting. Use when mastering audio to strict streaming platform loudness targets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Inter-sample_peaks"
---
# Audio Peak Limiter Inter Sample Peaks

## Overview
Sample-peak limiters miss analog waveform peaks that occur between discrete digital samples. True Peak limiters use 4x oversampling to catch inter-sample peaks, preventing lossy encoder clipping.

## Operational Workflow

1. **Set brickwall True Peak ceiling to -1.0 dBFS (or -2.0 dBFS for high-compression MP3 delivery).**:
   - Set brickwall True Peak ceiling to -1.0 dBFS (or -2.0 dBFS for high-compression MP3 delivery).

2. **Configure lookahead buffer (5ms) to catch instantaneous transient spikes transparently.**:
   - Configure lookahead buffer (5ms) to catch instantaneous transient spikes transparently.

3. **Adjust release time curve (50ms–100ms) to prevent audible gain pumping on dialogue peaks.**:
   - Adjust release time curve (50ms–100ms) to prevent audible gain pumping on dialogue peaks.

4. **Run ITU-R BS.1770 loudness meter to confirm maximum true peak compliance across entire track.**:
   - Run ITU-R BS.1770 loudness meter to confirm maximum true peak compliance across entire track.

## Recommended Tools & Environments
- True Peak Limiting
- EBU R128 / ITU-R BS.1770
- FFmpeg alimiter
- Mastering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
