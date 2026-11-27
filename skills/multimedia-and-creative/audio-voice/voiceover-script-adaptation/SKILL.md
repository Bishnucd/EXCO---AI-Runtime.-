---
name: voiceover-script-adaptation
description: Adapts written copy into a narration script that reads well aloud, with breath points, pacing marks, pronunciation notes, and timing estimates at a stated words-per-minute rate. Use when turning an article or product copy into a voice-over, when a narration sounds rushed or flat, or when preparing text for text-to-speech.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Voice-over Script Adaptation

Written prose and spoken prose are different formats. A sentence that reads well on a page often
collapses when spoken.

## When to use

- Converting an article, product page, or deck into narration.
- A voice-over sounds rushed, flat, or hard to follow.
- Preparing text for text-to-speech, which needs explicit pacing.
- Fitting a script to a fixed duration.

## Workflow

### 1. Establish the delivery parameters

| Parameter | Typical value | Effect |
|-----------|---------------|--------|
| Words per minute | 140–160 conversational; 120–140 instructional; 165+ energetic | Determines total length |
| Target duration | From the video or slot | Determines how much to cut |
| Tone | Warm, authoritative, conversational, neutral | Determines sentence shape |
| Audience | Expert, general, non-native speakers | Determines vocabulary and pace |
| Accent and pronunciation | Stated per name and term | Prevents retakes |

Compute the word budget: `duration_seconds ÷ 60 × wpm`. For 90 seconds at 150 wpm, that is 225
words. If the source is 400 words, the work is cutting, not rewriting.

### 2. Rewrite for the ear

- **Short sentences.** One idea per sentence. Split at every comma that is really a full stop.
- **Active voice.** "We fixed the delay" beats "the delay was fixed by us".
- **Concrete nouns and verbs.** Remove nominalisations: "make a decision" → "decide".
- **No nested clauses.** If a listener has to hold a clause open, rewrite.
- **Say numbers the way they are spoken.** "£4.2 million", not "£4,200,000". "2026" as "twenty
  twenty-six" unless it is a quantity.
- **Expand abbreviations on first use**, then use the short form.
- **Repeat the key term** rather than reaching for a synonym; listeners cannot re-read.

### 3. Mark the performance

Add marks the reader or TTS engine needs:

```
We built it for one reason. // (pause) //
To make the morning easier.
```

| Mark | Meaning |
|------|---------|
| `//` | Short pause (0.3–0.5 s) |
| `///` | Longer pause (0.8–1.2 s), paragraph break |
| `**word**` | Emphasis |
| `[breath]` | Deliberate breath point, not read aloud |
| `[pause 1s]` | Explicit hold for a visual beat |

Place breath points at clause boundaries, never mid-phrase. A 15-second sentence without a breath
mark will be read breathlessly.

### 4. Write pronunciation notes

For every proper noun, brand, acronym, and technical term: phonetic spelling and stress.

```
SaaS        "sass"
nginx       "engine-X"
Kubernetes  "koo-ber-NET-eez"
Aoife       "EE-fa"
```

### 5. Fit to time

Read the script aloud at the target pace and measure. Do not trust the word count alone: numbers,
acronyms, and pauses consume more time than their word count suggests. If over budget, cut whole
sentences from the lowest-value section rather than compressing every sentence.

### 6. Check for TTS-specific traps

- Homographs: `read`, `lead`, `live`, `record`, `close`, `wind`. Rewrite to avoid ambiguity.
- Initialisms that TTS will spell out or mangle: write the spoken form.
- Symbols: `&`, `%`, `#`, `+` may be read literally or skipped.
- Long numbers and decimals: write them as spoken.
- Lists: "first, second, third" rather than bullet characters.

## Rules

- Never pad to hit a duration; cut instead.
- Never leave a number, acronym, or name without a pronunciation decision if it is unfamiliar.
- Never write a sentence that requires a second listen to parse.
- Do not use a synonym for a key term just to avoid repetition.
- State the assumed WPM; a timing estimate without it is meaningless.

## Output format

```
script.md
  - delivery parameters block
  - marked script
  - pronunciation table
  - timing estimate per section and total
```

## Error handling

| Condition | Action |
|-----------|--------|
| Source is far over the word budget | Report the budget and propose the cuts before rewriting |
| A term has no agreed pronunciation | Flag it for the client; do not guess silently |
| Target duration is impossible at a natural pace | Say so, and give the minimum viable duration |
| Script will be both read and displayed | Produce two versions; the on-screen text can keep the longer sentences |

## Example

**Input:** 400-word product page, 90-second explainer, conversational tone.
**Output:** a 224-word marked script (1:29 at 150 wpm), 6 pronunciation entries, 14 breath marks,
and a note that two sentences were cut because they repeated the same benefit.
