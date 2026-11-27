---
name: video-storyboard
description: Turns a script or brief into a shootable storyboard with shot numbers, framing, duration, action, dialogue, and audio notes, plus a shot list and asset checklist. Use when planning a product video, explainer, tutorial, or social clip before filming or generating footage.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Video Storyboard

A storyboard exists to make the shoot boring. Every shot should be specified well enough that
someone else could film it without asking what you meant.

## When to use

- Planning any video longer than a few shots.
- Handing a video plan to a different person or an AI video tool.
- A script exists but nobody knows what the audience sees.
- A video keeps changing scope during editing.

## Workflow

### 1. Fix the constraints first

| Constraint | Effect on the board |
|------------|---------------------|
| Duration and aspect ratio | Determines shot count and framing |
| Platform | 9:16 needs vertical framing; 16:9 needs horizontal |
| Audience and single takeaway | Determines what gets cut |
| Budget and crew | Determines whether a shot is practical |
| Location and light | Determines shoot order and time of day |
| Presenter or voice-over | Determines whether mouth movement matters |

### 2. Write the spine in beats

Before shots, write 5–9 beats: the emotional or informational turns. For a 60-second product
video: problem → failed workaround → reveal → how it works → proof → call to action.

Every shot must serve a beat. If a shot serves no beat, cut it.

### 3. Convert beats to shots

One row per shot:

| # | Beat | Duration | Framing | Action | Audio | On-screen text |
|---|------|----------|---------|--------|-------|----------------|

Rules:
- Typical shot length 2–5 seconds for social, 4–8 for explainers. Long static shots lose
  attention; rapid cutting without purpose causes fatigue.
- Change the frame between consecutive shots: wide → close → medium. Two similar framings back
  to back read as a jump cut.
- Show the product in use, not only on a table.
- Specify the transition only when it carries meaning (a match cut, a hard cut on a beat). Do not
  write "cool transition" for every row.

### 4. Write the shot list for the shoot day

Group shots by location and lighting setup, not by story order, so the crew does not move the
camera forty times. For each setup: lens, height, movement, and the safety take.

### 5. Build the asset checklist

- Props, wardrobe, and set dressing per shot.
- Graphics, lower thirds, and logos with exact text.
- Music track and licence, or a brief for original audio.
- B-roll needed to cover edit points.
- Captions and translations required by the platform.

### 6. Check feasibility

For each shot, ask: can this be filmed in this location, with this light, in this time? Mark
anything that needs a permit, a special lens, or a generated shot. Flag the three shots most
likely to fail and provide an alternative for each.

### 7. Define the edit decision up front

State the target runtime, the hook in the first 2 seconds, and the exact call to action. This
prevents the classic outcome where the edit is 40 seconds too long and the CTA is unclear.

## Rules

- Every shot has a duration. A board without timings does not add up to the runtime.
- Every shot serves a named beat.
- Do not plan a shot that cannot be captured with the stated resources; offer an alternative.
- Do not specify a copyrighted song; name the licence requirement instead.
- Text on screen must be written exactly, including capitalisation, not described.

## Output format

```markdown
# Storyboard: <title>
Runtime: 0:58 | Aspect: 9:16 | Platform: <platform>

## Beats
1. <beat> (0:00–0:08)

## Shots
| # | Beat | In–Out | Framing | Action | Audio | On-screen text |

## Shot list (by setup)
### Setup A – kitchen counter, window light
- lens, height, movement, safety take

## Asset checklist
- props / graphics / music licence / captions

## Risky shots and alternatives
1. <shot> — risk — alternative
```

## Error handling

| Condition | Action |
|-----------|--------|
| Total durations exceed the target runtime | Cut shots by lowest beat value; show what was removed |
| Brief has no single takeaway | Ask; a video without one will not be edited coherently |
| A shot needs a location or permit not available | Substitute a practical alternative and mark it |
| Generated footage is planned | Note which shots depend on a model and the fallback if generation fails |

## Example

**Input:** 60-second product launch, vertical, no crew.
**Output:** six beats, 14 shots totalling 0:58, a shot list grouped into three setups, an asset
checklist, and two flagged risks (steam effect and a macro shot needing a special lens) with
alternatives.
