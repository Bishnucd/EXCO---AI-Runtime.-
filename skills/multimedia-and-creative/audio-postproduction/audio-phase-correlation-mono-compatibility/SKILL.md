---
name: audio-phase-correlation-mono-compatibility
description: Audits stereo phase correlation coefficients (-1 to +1) to detect and eliminate destructive mono cancellation. Use when preparing audio mixes for mobile phones and mono speakers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Phase_correlation"
---
# Audio Phase Correlation Mono Compatibility

## Overview
Stereo wideners can place left and right channels 180 degrees out of phase. When summed to mono on a smartphone speaker, out-of-phase instruments completely vanish due to phase cancellation.

## Operational Workflow

1. **Run audio through FFmpeg aphasemeter filter or real-time phase correlation meter.**:
   - Run audio through FFmpeg aphasemeter filter or real-time phase correlation meter.

2. **Audit correlation value across time**:
   - Audit correlation value across time: +1.0 indicates perfect mono, 0 indicates wide stereo, negative indicates phase issues.

3. **Identify offending tracks displaying negative correlation values below 0.**:
   - Identify offending tracks displaying negative correlation values below 0.

4. **Apply phase inversion or narrow stereo spread on offending tracks until correlation stays between +0.4 and +1.0.**:
   - Apply phase inversion or narrow stereo spread on offending tracks until correlation stays between +0.4 and +1.0.

## Recommended Tools & Environments
- Phase Metering
- Mono Compatibility
- FFmpeg aphasemeter
- Mastering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
