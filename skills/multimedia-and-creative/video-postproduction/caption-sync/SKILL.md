---
name: caption-sync
description: Creates and synchronises subtitles and captions for video, aligning timings to speech, splitting lines at natural pauses, and enforcing reading-speed and platform limits. Use when adding captions to a video, fixing captions that drift, or preparing subtitles for translation.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Caption Sync

Captions are read at a different speed than speech is heard. Good captions follow the speech
rhythm, respect reading limits, and never cover the thing the viewer is looking at.

## When to use

- Adding captions to a video.
- Existing captions drift out of sync.
- Preparing subtitles for translation.
- Repurposing long video into short clips.

## Workflow

### 1. Get an accurate transcript first

Machine transcription gives a starting point, not a finished caption file. Correct:

- names, brands, and technical terms;
- numbers, units, and currency;
- filler words, if the style guide removes them (be consistent);
- homophones that change meaning (`their`/`there`, `principal`/`principle`).

Keep a copy of the raw transcript; re-transcribing to fix one word loses other corrections.

### 2. Split into caption cues

Rules per cue:

| Rule | Value |
|------|-------|
| Characters per line | 32–42 (CPS-dependent) |
| Lines per cue | 1–2 |
| Duration | 1.0–6.0 s |
| Reading speed | ≤ 17 characters per second for adult content |
| Gap between cues | ≥ 2 frames, so the eye registers a change |
| Minimum duration | 1.0 s, even for a short word |

Break at natural boundaries: clause ends, punctuation, breath pauses. Never split an article
from its noun (`the` / `table`) or a name across cues.

### 3. Align to the waveform

- Snap cue in-points to the first phoneme, not to silence before it. Late captions feel laggy;
  100 ms early is more comfortable than 100 ms late.
- Snap out-points to the end of the last phoneme, then extend slightly into the pause.
- Check drift at 0%, 25%, 50%, 75%, and 100% of the runtime. Constant offset → shift everything.
  Increasing drift → wrong frame rate (23.976 vs 24, 25 vs 25 fps), fix the conversion, not each
  cue.

### 4. Handle the awkward cases

| Case | Approach |
|------|----------|
| Overlapping speech | Two cues on separate lines, or one cue with speaker labels |
| Very fast speech | Reduce text (remove filler), do not exceed reading speed |
| Song lyrics | Caption only if licensed; otherwise `[music]` |
| Sound effects | `[door slams]` in square brackets, only if meaningful |
| Speaker changes | Use a label or a consistent colour; state the convention |
| Text already on screen | Do not duplicate it verbatim in a caption over it |

### 5. Position safely

- Keep captions out of the lower-third where platform UI overlays them (especially 9:16).
- Avoid covering faces, product labels, or on-screen text.
- Use a background box or outline sufficient for contrast over any frame; check on the brightest
  and darkest shots.

### 6. Export and verify

- Primary: `.srt` or `.vtt` in UTF-8 without BOM.
- Burned-in variant only if the platform requires it; keep the sidecar file too.
- Play the full video once with captions on. Check: no cue is unreadable, none is out of sync,
  none is truncated mid-word, and no cue is under 1 second.

## Rules

- Never machine-translate a caption file without a native-speaker review pass.
- Never exceed the reading-speed limit to preserve every spoken word; edit the text.
- Never let a cue span a scene cut.
- Never put a caption where it hides the subject's mouth in a talking-head video if it can be
  avoided.
- Preserve speaker labels consistently; do not invent names.

## Output format

```
captions/
├── transcript.raw.txt
├── transcript.corrected.txt
├── captions.srt
├── captions.vtt
└── CAPTION_NOTES.md   # conventions, reading speed, known issues, translation status
```

## Error handling

| Condition | Action |
|-----------|--------|
| Audio is unintelligible for a passage | Mark `[inaudible 00:04:12]`; do not invent dialogue |
| Frame rate mismatch detected | Convert timings with the correct ratio; report the factor used |
| Multiple speakers overlap heavily | Use positional captions and a speaker key; note reduced readability |
| Platform requires burned-in captions | Produce both burned-in and sidecar; keep the sidecar as the source of truth |

## Example

**Input:** 12-minute interview, 25 fps, YouTube plus vertical clips.
**Output:** a corrected transcript, 214 cues at ≤17 CPS, zero cues over 6 s, a note that two
passages were inaudible, and a second vertical-safe caption track positioned above the UI zone.
