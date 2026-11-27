---
name: stereo-widening-mid-side-processing
description: Expands spatial stereo width and audits mono compatibility using Mid/Side (M/S) matrix processing. Use when widening broadcast audio without causing phase cancellation in mono.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Audio_signal_processing#Mid-side_processing"
---
# Stereo Widening Mid Side Processing

## Overview
Mid/Side processing decomposes stereo audio into Mid (L+R, center channel) and Side (L-R, spatial width) signals, allowing independent EQ and gain adjustment without muddying mono playback.

## Operational Workflow

1. **Encode Left and Right stereo channels into Mid (center) and Side (spatial difference) channels.**:
   - Encode Left and Right stereo channels into Mid (center) and Side (spatial difference) channels.

2. **Apply subtle high-shelf EQ boost or gain boost (+1dB to +2dB) exclusively to Side channel.**:
   - Apply subtle high-shelf EQ boost or gain boost (+1dB to +2dB) exclusively to Side channel.

3. **Check phase correlation meter to verify correlation coefficient remains firmly above +0.5.**:
   - Check phase correlation meter to verify correlation coefficient remains firmly above +0.5.

4. **Sum to mono to verify that center vocals and primary instruments do not cancel out.**:
   - Sum to mono to verify that center vocals and primary instruments do not cancel out.

## Recommended Tools & Environments
- Mid/Side Processing
- Phase Metering
- FFmpeg
- Audio Engineering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
