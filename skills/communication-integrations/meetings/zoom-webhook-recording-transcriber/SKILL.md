---
name: zoom-webhook-recording-transcriber
description: Receives Zoom cloud recording webhooks, downloads video/audio assets, and triggers automated speech transcription. Use when ingesting meeting recordings for automatic summarization.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.zoom.us/docs/api/rest/webhook-reference/"
---
# Zoom Webhook Recording Transcriber

## Overview
Automating meeting notes starts with secure webhook ingestion. Receiving recording.completed webhooks, verifying HMAC signatures, and dispatching transcription pipelines eliminates manual downloads.

## Operational Workflow

1. **Validate Zoom webhook endpoint verification challenge and request HMAC signatures.**:
   - Validate Zoom webhook endpoint verification challenge and request HMAC signatures.

2. **Parse recording.completed payload to obtain cloud recording download tokens and asset URLs.**:
   - Parse recording.completed payload to obtain cloud recording download tokens and asset URLs.

3. **Stream audio tracks directly into object storage buckets.**:
   - Stream audio tracks directly into object storage buckets.

4. **Dispatch asynchronous audio transcription tasks using Whisper or cloud speech APIs.**:
   - Dispatch asynchronous audio transcription tasks using Whisper or cloud speech APIs.

## Recommended Tools & Environments
- Zoom Webhooks
- Node.js
- Whisper / Google Speech API
- AWS S3

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
