---
name: animated-lower-third-title-generation-ass
description: Renders dynamic lower-third title graphics with custom typography and drop shadows using Advanced SubStation Alpha (.ass). Use when burning animated speaker names into video clips.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/SubStation_Alpha#Advanced_SubStation_Alpha"
---
# Animated Lower Third Title Generation Ass

## Overview
ASS subtitle format supports vector drawing commands, custom font styling, rotation angles, and alpha fades, allowing developers to create broadcast-quality lower-third titles via plaintext files.

## Operational Workflow

1. **Author .ass script defining V4+ Styles with font, size, outline color, and drop shadow offsets.**:
   - Author .ass script defining V4+ Styles with font, size, outline color, and drop shadow offsets.

2. **Write Dialogue event with timing (00**:
   - Write Dialogue event with timing (00:00:02.00 to 00:00:07.00) and styling override tags (\fad(500,500)).

3. **Include speaker name in bold primary font and corporate title in smaller secondary font.**:
   - Include speaker name in bold primary font and corporate title in smaller secondary font.

4. **Burn subtitles into video using FFmpeg -vf "ass=lower_third.ass" with hardware acceleration.**:
   - Burn subtitles into video using FFmpeg -vf "ass=lower_third.ass" with hardware acceleration.

## Recommended Tools & Environments
- ASS Subtitles
- FFmpeg ass Filter
- Lower Thirds
- Typography

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
