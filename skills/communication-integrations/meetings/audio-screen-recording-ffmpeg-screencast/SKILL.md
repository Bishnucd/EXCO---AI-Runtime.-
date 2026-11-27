---
name: audio-screen-recording-ffmpeg-screencast
description: Captures synchronized desktop screen video and microphone audio into lightweight MP4 recordings via FFmpeg. Use when automating meeting recording and demo video capture.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://trac.ffmpeg.org/wiki/Capture/Desktop"
---
# Audio Screen Recording Ffmpeg Screencast

## Overview
Recording meeting presentations requires low-latency desktop screen capture synchronized with microphone audio. Native OS capture devices (gdigrab, avfoundation) record smoothly without dropping frames.

## Operational Workflow

1. **Select OS screen grabber device (gdigrab on Windows, x11grab on Linux, avfoundation on macOS).**:
   - Select OS screen grabber device (gdigrab on Windows, x11grab on Linux, avfoundation on macOS).

2. **Capture desktop screen at 30fps with ultrafast x264 preset to minimize CPU load.**:
   - Capture desktop screen at 30fps with ultrafast x264 preset to minimize CPU load.

3. **Capture native microphone audio input using dshow or pulse audio drivers.**:
   - Capture native microphone audio input using dshow or pulse audio drivers.

4. **Multiplex video and AAC audio into standard MP4 container with web-optimized faststart.**:
   - Multiplex video and AAC audio into standard MP4 container with web-optimized faststart.

## Recommended Tools & Environments
- FFmpeg
- gdigrab (Win) / x11grab (Linux) / avfoundation (Mac)
- H.264 / AAC

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
