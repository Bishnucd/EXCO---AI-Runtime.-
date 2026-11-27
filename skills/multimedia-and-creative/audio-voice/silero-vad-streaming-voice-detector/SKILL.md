---
name: silero-vad-streaming-voice-detector
description: Detects human speech segments in real-time audio streams with sub-millisecond latency using Silero VAD. Use when triggering voice recording, speech-to-text, and conversational interruptions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/snakers4/silero-vad"
---
# Silero Vad Streaming Voice Detector

## Overview
Energy-based thresholding fails in noisy environments. Silero VAD is an ultra-lightweight neural network that reliably classifies speech vs background noise in 30ms streaming chunks.

## Operational Workflow

1. **Initialize Silero VAD ONNX model with 512-sample (32ms at 16kHz) buffer chunk size.**:
   - Initialize Silero VAD ONNX model with 512-sample (32ms at 16kHz) buffer chunk size.

2. **Stream audio chunks into model and evaluate returned speech probability score (0.0 to 1.0).**:
   - Stream audio chunks into model and evaluate returned speech probability score (0.0 to 1.0).

3. **Apply hysteresis thresholding (trigger speech on >0.5, end speech after 300ms of <0.35).**:
   - Apply hysteresis thresholding (trigger speech on >0.5, end speech after 300ms of <0.35).

4. **Emit speech start/stop timestamps to coordinate downstream speech-to-text processing.**:
   - Emit speech start/stop timestamps to coordinate downstream speech-to-text processing.

## Recommended Tools & Environments
- Silero VAD
- Voice Activity Detection
- ONNX / PyTorch
- Real-Time Streaming

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
