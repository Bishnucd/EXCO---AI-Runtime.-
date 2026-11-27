---
name: sidechain-audio-ducking-compression
description: Ducks background music volume automatically whenever spoken dialogue occurs using sidechain compression. Use when producing videos, tutorials, and radio broadcasts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#sidechaincompress"
---
# Sidechain Audio Ducking Compression

## Overview
Sidechain ducking feeds dialogue audio into the detector circuit of a compressor placed on the background music track, lowering music volume by 12dB–18dB whenever speech is present.

## Operational Workflow

1. **Route spoken voice track to compressor sidechain control input.**:
   - Route spoken voice track to compressor sidechain control input.

2. **Insert compressor onto background music track with 4**:
   - Insert compressor onto background music track with 4:1 compression ratio.

3. **Tune threshold and attack time (20ms) so music ducks smoothly without jarring volume jumps.**:
   - Tune threshold and attack time (20ms) so music ducks smoothly without jarring volume jumps.

4. **Set release time (400ms–800ms) so music swells back up naturally during conversational pauses.**:
   - Set release time (400ms–800ms) so music swells back up naturally during conversational pauses.

## Recommended Tools & Environments
- Sidechain Compression
- Audio Ducking
- FFmpeg sidechaincompress
- Post-Production

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
