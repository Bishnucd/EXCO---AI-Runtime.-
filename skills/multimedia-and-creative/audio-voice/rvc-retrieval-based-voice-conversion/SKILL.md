---
name: rvc-retrieval-based-voice-conversion
description: Converts vocal timbre between speakers using Retrieval-based Voice Conversion (RVC) and HuBERT features. Use when cloning character voices and transforming speech timbre with pitch accuracy.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI"
---
# Rvc Retrieval Based Voice Conversion

## Overview
RVC extracts phonetic representations from audio using HuBERT, retrieves nearest timbre vectors from a target speaker feature index, and synthesizes target voice characteristics.

## Operational Workflow

1. **Extract continuous HuBERT content features and Harvest/PM pitch contours (F0) from source audio.**:
   - Extract continuous HuBERT content features and Harvest/PM pitch contours (F0) from source audio.

2. **Retrieve nearest target voice feature embeddings from indexed FAISS feature database.**:
   - Retrieve nearest target voice feature embeddings from indexed FAISS feature database.

3. **Synthesize target speaker waveform using VITS-based neural vocoder pipeline.**:
   - Synthesize target speaker waveform using VITS-based neural vocoder pipeline.

4. **Apply post-processing index rate blending to retain natural source inflections.**:
   - Apply post-processing index rate blending to retain natural source inflections.

## Recommended Tools & Environments
- RVC
- HuBERT
- PyTorch
- Voice Conversion

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
