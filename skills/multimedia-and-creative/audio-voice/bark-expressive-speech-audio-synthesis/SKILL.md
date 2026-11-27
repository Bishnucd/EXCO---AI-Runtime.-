---
name: bark-expressive-speech-audio-synthesis
description: Generates expressive speech with non-verbal vocalizations (laughter, sighing, pauses) using Suno Bark. Use when synthesizing highly realistic, emotionally dynamic character dialogue.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/suno-ai/bark"
---
# Bark Expressive Speech Audio Synthesis

## Overview
Bark is a transformer-based text-to-audio model that understands semantic text prompts and generates expressive speech, laughter, gasps, and background music without separate phoneme alignment.

## Operational Workflow

1. **Load Bark model weights with EnCodec neural audio codec tokenizer.**:
   - Load Bark model weights with EnCodec neural audio codec tokenizer.

2. **Format input text prompt including non-verbal cue tags (e.g., "[laughs]", "[sighs]", "[clears throat]").**:
   - Format input text prompt including non-verbal cue tags (e.g., "[laughs]", "[sighs]", "[clears throat]").

3. **Select voice preset prompt embedding matching desired character language and gender.**:
   - Select voice preset prompt embedding matching desired character language and gender.

4. **Generate acoustic tokens through transformer stages and decode into 24kHz audio waveform.**:
   - Generate acoustic tokens through transformer stages and decode into 24kHz audio waveform.

## Recommended Tools & Environments
- Bark (Suno)
- Neural Audio Generation
- EnCodec
- Expressive TTS

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
