---
name: live-transcription-websocket-streamer
description: Streams live microphone audio chunks over WebSockets to real-time speech-to-text APIs (Deepgram, AssemblyAI). Use when displaying live real-time captions during ongoing meetings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.deepgram.com/docs/getting-started-with-live-streaming-audio"
---
# Live Transcription Websocket Streamer

## Overview
Displaying real-time subtitles requires low-latency streaming. Slicing microphone audio into 100ms Linear PCM chunks and streaming over WebSockets returns partial transcripts with sub-300ms latency.

## Operational Workflow

1. **Initialize client microphone audio stream at 16kHz 16-bit mono PCM.**:
   - Initialize client microphone audio stream at 16kHz 16-bit mono PCM.

2. **Open authenticated WebSocket connection to streaming speech-to-text service.**:
   - Open authenticated WebSocket connection to streaming speech-to-text service.

3. **Stream raw binary audio chunks continuously every 100ms.**:
   - Stream raw binary audio chunks continuously every 100ms.

4. **Receive live JSON transcript messages with is_final flags and render scrolling subtitles.**:
   - Receive live JSON transcript messages with is_final flags and render scrolling subtitles.

## Recommended Tools & Environments
- WebSockets
- Deepgram API
- Linear PCM Audio
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
