---
name: video-concat-demuxer-lossless-assembly
description: Losslessly concatenates segmented MP4/MKV video files without re-encoding using the FFmpeg concat demuxer. Use when assembling video segments instantly with zero generation loss.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://trac.ffmpeg.org/wiki/Concatenate#demuxer"
---
# Video Concat Demuxer Lossless Assembly

## Overview
Re-encoding video during assembly reduces visual quality and wastes minutes of CPU time. The concat demuxer splices identical video codec streams at packet level with zero re-encoding in milliseconds.

## Operational Workflow

1. **Create plaintext file list (inputs.txt) specifying file paths**:
   - Create plaintext file list (inputs.txt) specifying file paths: file 'part1.mp4' 
 file 'part2.mp4'.

2. **Verify that all video files share identical video codec, resolution, and timebase settings.**:
   - Verify that all video files share identical video codec, resolution, and timebase settings.

3. **Execute concat command**:
   - Execute concat command: ffmpeg -f concat -safe 0 -i inputs.txt -c copy output.mp4.

4. **Confirm output video plays seamlessly across cut transitions without audio pops or frame freezing.**:
   - Confirm output video plays seamlessly across cut transitions without audio pops or frame freezing.

## Recommended Tools & Environments
- FFmpeg Concat Demuxer
- Lossless Assembly
- Zero-Transcode
- CLI Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
