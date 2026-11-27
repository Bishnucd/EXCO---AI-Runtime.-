---
name: voice-cloning-sample-curation
description: Curates, denoises, and segments clean vocal audio samples for few-shot AI voice cloning and model adaptation. Use when preparing reference voice recordings for high-fidelity voice synthesis.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/coqui-ai/TTS"
---
# Voice Cloning Sample Curation

## Overview
Voice cloning quality depends entirely on training audio purity. Reference audio must be dry (zero reverb), free of background noise, emotionally consistent, and segmented into 3-10 second clips.

## Operational Workflow

1. **Select reference audio clips featuring clean vocal delivery and consistent microphone distance.**:
   - Select reference audio clips featuring clean vocal delivery and consistent microphone distance.

2. **Apply de-reverb and de-hum spectral filtering to isolate dry vocal frequencies.**:
   - Apply de-reverb and de-hum spectral filtering to isolate dry vocal frequencies.

3. **Segment audio into 3-10 second sentence-level WAV files with normalized amplitudes.**:
   - Segment audio into 3-10 second sentence-level WAV files with normalized amplitudes.

4. **Generate accompanying verbatim transcript text files for acoustic alignment verification.**:
   - Generate accompanying verbatim transcript text files for acoustic alignment verification.

## Recommended Tools & Environments
- Python 3.10+
- Librosa
- Audacity / FFmpeg
- WAV Audio

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
