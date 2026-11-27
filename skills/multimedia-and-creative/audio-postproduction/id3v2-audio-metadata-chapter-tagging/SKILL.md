---
name: id3v2-audio-metadata-chapter-tagging
description: Embeds ID3v2.4 podcast chapter markers, embedded cover art images, and episode metadata into MP3/AAC files. Use when publishing professional podcast episodes with clickable chapter markers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://id3.org/id3v2.4.0-structure"
---
# Id3v2 Audio Metadata Chapter Tagging

## Overview
ID3v2.4 tags allow podcast players to display clickable chapter markers, timing boundaries, per-chapter artwork, and episode URLs directly within modern podcast applications.

## Operational Workflow

1. **Define chapter timeline list with start millisecond, end millisecond, title, and optional URL.**:
   - Define chapter timeline list with start millisecond, end millisecond, title, and optional URL.

2. **Construct CHAP and CTOC ID3 frames using Python mutagen library or FFmpeg metadata flags.**:
   - Construct CHAP and CTOC ID3 frames using Python mutagen library or FFmpeg metadata flags.

3. **Attach square 3000x3000px JPEG cover art to APIC metadata frame.**:
   - Attach square 3000x3000px JPEG cover art to APIC metadata frame.

4. **Write tags to final MP3 file and test playback chapter navigation in Apple Podcasts or VLC.**:
   - Write tags to final MP3 file and test playback chapter navigation in Apple Podcasts or VLC.

## Recommended Tools & Environments
- ID3v2.4
- Mutagen (Python)
- FFmpeg
- Podcast Metadata

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
