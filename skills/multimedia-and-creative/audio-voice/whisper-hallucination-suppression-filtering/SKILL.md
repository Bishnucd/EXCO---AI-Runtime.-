---
name: whisper-hallucination-suppression-filtering
description: Suppresses repetitive loop hallucinations and phantom text in Whisper speech transcription using token entropy filtering. Use when transcribing audio containing background music or silence.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/openai/whisper/discussions/679"
---
# Whisper Hallucination Suppression Filtering

## Overview
Whisper models can enter infinite repetition loops (e.g., repeating "Thank you for watching" during silent background music). Tuning temperature fallbacks and repetition penalties eliminates loops.

## Operational Workflow

1. **Set temperature parameter with fallback sequence**:
   - Set temperature parameter with fallback sequence: temperature=(0.0, 0.2, 0.4, 0.8).

2. **Configure compression_ratio_threshold=2.4 to detect pathological text repetition loops.**:
   - Configure compression_ratio_threshold=2.4 to detect pathological text repetition loops.

3. **Enable logprob_threshold=-1.0 and no_speech_threshold=0.6 to discard silent audio hallucinations.**:
   - Enable logprob_threshold=-1.0 and no_speech_threshold=0.6 to discard silent audio hallucinations.

4. **Post-process transcription text with regex deduplication filters to remove stuttered phrases.**:
   - Post-process transcription text with regex deduplication filters to remove stuttered phrases.

## Recommended Tools & Environments
- Whisper
- Hallucination Mitigation
- Repetition Penalty
- ASR

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
