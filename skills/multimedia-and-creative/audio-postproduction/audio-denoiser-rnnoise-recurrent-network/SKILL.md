---
name: audio-denoiser-rnnoise-recurrent-network
description: Suppresses complex background noise in real-time audio streams using Mozilla RNNoise recurrent neural networks. Use when eliminating stationary and non-stationary background noise from dialogue.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/xiph/rnnoise"
---
# Audio Denoiser Rnnoise Recurrent Network

## Overview
Traditional spectral subtraction causes musical noise artifacts. RNNoise uses classical signal processing for pitch analysis combined with a deep GRU RNN to suppress background noise cleanly.

## Operational Workflow

1. **Extract 22 Bark-scale frequency band energies and pitch correlation coefficients from audio frames.**:
   - Extract 22 Bark-scale frequency band energies and pitch correlation coefficients from audio frames.

2. **Feed feature vectors into lightweight GRU neural network to predict band gains (0.0 to 1.0).**:
   - Feed feature vectors into lightweight GRU neural network to predict band gains (0.0 to 1.0).

3. **Apply predicted spectral gains to filter out keyboard clicks, traffic rumble, and fan noise.**:
   - Apply predicted spectral gains to filter out keyboard clicks, traffic rumble, and fan noise.

4. **Reconstruct clean 48kHz audio waveform with minimal phase distortion or vocal degradation.**:
   - Reconstruct clean 48kHz audio waveform with minimal phase distortion or vocal degradation.

## Recommended Tools & Environments
- RNNoise (Mozilla/Xiph)
- Recurrent Neural Networks (GRU)
- Audio Denoising
- DSP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
