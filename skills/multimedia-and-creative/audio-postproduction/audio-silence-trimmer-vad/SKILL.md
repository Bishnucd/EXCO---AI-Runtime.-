---
name: audio-silence-trimmer-vad
description: Detects and removes awkward dead air pauses and silences from vocal audio using Voice Activity Detection (VAD). Use when tightening pacing and reducing file duration of raw spoken recordings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/snakers4/silero-vad"
---
# Audio Silence Trimmer Vad

## Overview
Raw conversational recordings contain prolonged pauses, hesitation breaks, and dead air. Deep learning Voice Activity Detection (VAD) identifies genuine speech segments and trims excess silence.

## Operational Workflow

1. **Load audio waveform and resample to 16kHz for VAD neural model processing.**:
   - Load audio waveform and resample to 16kHz for VAD neural model processing.

2. **Execute Silero VAD to generate speech probability timestamps across the timeline.**:
   - Execute Silero VAD to generate speech probability timestamps across the timeline.

3. **Identify non-speech intervals exceeding duration threshold (e.g. > 1.2 seconds).**:
   - Identify non-speech intervals exceeding duration threshold (e.g. > 1.2 seconds).

4. **Splice audio segments to compress pause durations down to natural conversational pauses (400ms).**:
   - Splice audio segments to compress pause durations down to natural conversational pauses (400ms).

## Recommended Tools & Environments
- Python 3.10+
- Silero VAD
- PyTorch
- FFmpeg

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
