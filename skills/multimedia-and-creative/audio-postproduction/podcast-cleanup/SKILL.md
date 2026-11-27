---
name: podcast-cleanup
description: Cleans and masters spoken-word audio by removing noise and room tone, levelling speakers, controlling plosives and sibilance, and hitting a target loudness with true-peak limits. Use when preparing a podcast, interview, or voice-over recording, or when two speakers sound at different volumes.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Podcast Cleanup

Order matters more than any single tool. Each stage changes what the next stage can do.

## When to use

- Preparing a podcast or interview for publication.
- Speakers recorded on different microphones or in different rooms.
- Hiss, hum, clicks, or room echo are audible.
- Levels are inconsistent between speakers or segments.

## Workflow

### 1. Assess before processing

Listen to 60 seconds of the worst section. Record:

| Property | Why |
|----------|-----|
| Sample rate and bit depth | Work at the highest available; export at the target |
| Noise floor | Determines how aggressive denoising can be |
| Peak and integrated loudness | Shows how much gain is needed |
| DC offset | Causes clicks and wastes headroom |
| Room echo | Cannot be removed by EQ; needs a different approach |
| Speaker count and channel layout | Determines whether to process per-track or per-region |

### 2. Fix what cannot be fixed later

- **Edit first**: remove false starts, long pauses, and mouth noise. Editing after compression is
  harder because the noise floor moves.
- **DC offset**: high-pass at 60–80 Hz (male) or 80–100 Hz (female) to remove rumble without
  thinning the voice.
- **Clipping**: if a peak is clipped, do not "restore" it with a declipper and call it clean; note
  it and re-record if possible.

### 3. Remove noise with restraint

- Capture a noise profile from a silent passage, then apply spectral reduction at 6–10 dB. More
  than ~12 dB starts to produce artefacts that sound worse than the noise.
- Use a gate only on non-speech if the noise is intermittent; a gate on continuous room tone
  produces pumping.
- De-hum at the exact mains frequency (50 or 60 Hz) and its harmonics.

### 4. Control dynamics per speaker

- Compress each speaker separately if they are on separate tracks: ratio 2:1–3:1, attack
  5–15 ms, release 80–150 ms, aiming for 3–6 dB of gain reduction on loud passages.
- De-ess before or after compression, not both. Target the 5–9 kHz band; 3–6 dB of reduction.
- Plosives: a high-pass plus a short dynamic dip around 80–120 Hz on the offending syllable.

### 5. Match speakers, then master

- Match integrated loudness between speakers to within 1 LU before final limiting.
- Target loudness: **−16 LUFS integrated** for stereo podcast, **−19 LUFS** for mono spoken word,
  unless the platform specifies otherwise.
- True peak ceiling: **−1 dBTP**.
- Use a limiter only for the last 1–3 dB; if it is working harder than that, fix the dynamics
  earlier.

### 6. Verify by measurement and by ear

- Measure integrated loudness, loudness range, and true peak on the final file.
- Check the first 10 seconds and the last 10 seconds for level jumps.
- Listen on phone speakers and on headphones; phone speakers expose mud and sibilance.
- Confirm no stage introduced artefacts: clicks at edit points, metallic tails after denoising,
  pumping from the gate.

## Rules

- Never apply noise reduction before editing; you will denoise audio you are about to delete.
- Never normalise a whole file to 0 dBFS; that guarantees clipping on later encoding.
- Never use a de-esser and a multiband compressor on the same sibilance band without checking for
  lisping.
- Never report a loudness figure you did not measure on the exported file.
- Preserve the unprocessed original.

## Output format

```
original/            untouched
edit/                edited, pre-processing
master/              final, measured
MASTERING_NOTES.md   # chain used, settings, measured LUFS/LRA/true peak
```

## Error handling

| Condition | Action |
|-----------|--------|
| Noise floor is very high | Report that denoising will cost clarity; recommend re-recording if possible |
| Speakers are on a single mixed track | Process globally and accept a compromise; state it |
| Heavy room echo | Recommend a de-reverb pass with caution, and note that intelligibility may drop |
| Loudness target unknown | Use −16 LUFS stereo and state the assumption |
| Clipping present | Report the timestamps; do not claim the audio is clean |

## Example

**Input:** two-host podcast, separate tracks, one recorded in a noisy room.
**Output:** edited master at −16.0 LUFS, −1.2 dBTP, 7 LU range, the noisy track denoised at 8 dB,
per-speaker compression, and a note listing three clipped syllables that were not recoverable.
