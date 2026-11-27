---
name: whisper-speaker-diarization-pyannote
description: Separates and attributes spoken audio segments to distinct speakers using PyAnnote.audio speaker diarization. Use when generating multi-speaker meeting transcripts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/pyannote/pyannote-audio"
---
# Whisper Speaker Diarization Pyannote

## Overview
Raw transcription generates an unformatted wall of text. Speaker diarization clusters vocal acoustic embeddings, identifying exactly who spoke each sentence (Speaker 0, Speaker 1).

## Operational Workflow

1. **Resample meeting audio track to 16kHz mono WAV format.**:
   - Resample meeting audio track to 16kHz mono WAV format.

2. **Execute pyannote.audio speaker diarization pipeline to generate speaker turn intervals.**:
   - Execute pyannote.audio speaker diarization pipeline to generate speaker turn intervals.

3. **Execute Whisper speech-to-text to transcribe word timestamps.**:
   - Execute Whisper speech-to-text to transcribe word timestamps.

4. **Align Whisper word timestamps with diarization speaker boundaries to produce formatted dialogue.**:
   - Align Whisper word timestamps with diarization speaker boundaries to produce formatted dialogue.

## Recommended Tools & Environments
- pyannote.audio
- OpenAI Whisper
- PyTorch
- Audio Diarization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
