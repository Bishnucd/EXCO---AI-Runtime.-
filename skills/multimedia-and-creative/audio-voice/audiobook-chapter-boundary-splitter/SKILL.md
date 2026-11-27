---
name: audiobook-chapter-boundary-splitter
description: Detects narrative chapter boundaries and splits long recordings into ACX-compliant audiobook files. Use when formatting audiobooks to meet Audible and distributor technical standards.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.acx.com/help/acx-audio-submission-requirements/201456300"
---
# Audiobook Chapter Boundary Splitter

## Overview
Audiobook platforms like Audible/ACX require separate chapter files, strict room tone silence padding (0.5s head, 1–5s tail), and peak levels below -3dB True Peak. Automated splitters enforce these rules.

## Operational Workflow

1. **Detect spoken chapter markers ("Chapter 1", "Prologue") using Whisper forced alignment or silence detection.**:
   - Detect spoken chapter markers ("Chapter 1", "Prologue") using Whisper forced alignment or silence detection.

2. **Split continuous master audio into discrete chapter audio segments.**:
   - Split continuous master audio into discrete chapter audio segments.

3. **Pad each file with exactly 0.5s of clean room tone silence at start and 3.0s at the end.**:
   - Pad each file with exactly 0.5s of clean room tone silence at start and 3.0s at the end.

4. **Verify RMS loudness (-18 to -23 LUFS) and peak levels (-3.0 dBFS) to guarantee 100% ACX compliance.**:
   - Verify RMS loudness (-18 to -23 LUFS) and peak levels (-3.0 dBFS) to guarantee 100% ACX compliance.

## Recommended Tools & Environments
- ACX Standards
- Silence Detection
- Audio Splitting
- FFmpeg / Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
