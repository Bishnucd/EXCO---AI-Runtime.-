---
name: huddle-virtual-office-room-routing
description: Routes peer-to-peer audio and video mesh connections for virtual office spaces using WebRTC and LiveKit. Use when building spontaneous drop-in voice rooms and office huddles.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.livekit.io/home/"
---
# Huddle Virtual Office Room Routing

## Overview
Spontaneous team huddles require instant connection without calendar friction. LiveKit provides an open-source WebRTC Selective Forwarding Unit (SFU) for low-latency drop-in team audio rooms.

## Operational Workflow

1. **Generate signed room join tokens embedding participant identity and room permissions.**:
   - Generate signed room join tokens embedding participant identity and room permissions.

2. **Establish WebRTC peer connection to LiveKit media server.**:
   - Establish WebRTC peer connection to LiveKit media server.

3. **Publish local microphone audio track with adaptive echo cancellation and noise suppression.**:
   - Publish local microphone audio track with adaptive echo cancellation and noise suppression.

4. **Subscribe to active speaker tracks and display dynamic avatar audio waveforms.**:
   - Subscribe to active speaker tracks and display dynamic avatar audio waveforms.

## Recommended Tools & Environments
- LiveKit
- WebRTC
- Selective Forwarding Unit (SFU)
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
