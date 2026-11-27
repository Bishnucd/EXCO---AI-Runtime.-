---
name: whisper-forced-alignment-word-timestamps
description: Generates word-level audio alignment timestamps using OpenAI Whisper and CTC forced alignment. Use when generating karaoke-style animated captions and frame-accurate word highlights.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/m-bain/whisperX"
---
# Whisper Forced Alignment Word Timestamps

## Overview
Standard subtitle files provide sentence-level intervals. Forced alignment maps acoustic phonemes directly to individual words, producing millisecond-accurate start and end timestamps.

## Operational Workflow

1. **Transcribe audio stream and obtain segment-level character hypotheses.**:
   - Transcribe audio stream and obtain segment-level character hypotheses.

2. **Align audio phoneme probabilities with ground-truth transcript using wav2vec2 CTC aligner.**:
   - Align audio phoneme probabilities with ground-truth transcript using wav2vec2 CTC aligner.

3. **Extract millisecond-level start and end timestamps for every spoken word.**:
   - Extract millisecond-level start and end timestamps for every spoken word.

4. **Export word timestamps in JSON or WebVTT format for synchronized dynamic captions.**:
   - Export word timestamps in JSON or WebVTT format for synchronized dynamic captions.

## Recommended Tools & Environments
- WhisperX
- PyTorch
- torchaudio
- JSON / WebVTT

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
