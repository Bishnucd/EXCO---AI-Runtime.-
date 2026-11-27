---
name: hdr-to-sdr-tone-mapping-mobius-reinhard
description: Converts HDR10 / Dolby Vision wide-gamut footage to standard BT.709 SDR video using Reinhard and Mobius tone mapping. Use when preventing washed-out colors on standard displays.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://ffmpeg.org/ffmpeg-filters.html#tonemap"
---
# Hdr To Sdr Tone Mapping Mobius Reinhard

## Overview
Playing HDR (BT.2020 PQ/HLG) video on standard SDR displays causes milky, washed-out grey tones. Tone mapping compresses high-dynamic range highlights into standard 100-nit Rec.709 color gamut.

## Operational Workflow

1. **Initialize FFmpeg zscale or tonemap filter with BT.2020 input color primaries and transfer characteristics.**:
   - Initialize FFmpeg zscale or tonemap filter with BT.2020 input color primaries and transfer characteristics.

2. **Apply Mobius or Reinhard tone-mapping algorithm to roll off peak specular highlights smoothly.**:
   - Apply Mobius or Reinhard tone-mapping algorithm to roll off peak specular highlights smoothly.

3. **Convert color matrix to standard BT.709 with 8-bit yuv420p pixel format.**:
   - Convert color matrix to standard BT.709 with 8-bit yuv420p pixel format.

4. **Verify that highlight details (clouds, light sources) are preserved without clipping or color shifts.**:
   - Verify that highlight details (clouds, light sources) are preserved without clipping or color shifts.

## Recommended Tools & Environments
- HDR to SDR
- Tone Mapping
- Mobius / Reinhard
- FFmpeg zscale

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
