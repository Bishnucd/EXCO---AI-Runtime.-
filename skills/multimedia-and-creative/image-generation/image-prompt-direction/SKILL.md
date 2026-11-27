---
name: image-prompt-direction
description: Turns a vague visual brief into a structured image-generation prompt with subject, composition, lighting, lens, palette, and negative constraints, then iterates by changing one variable at a time and keeps a consistency sheet across a set. Use when generating hero images, illustrations, or a consistent series of visuals.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Image Prompt Direction

A prompt is a set of independent decisions. Change one at a time, or you learn nothing from the
iteration.

## When to use

- Converting a written brief into an image prompt.
- Producing a set of images that must look like they belong together.
- An existing prompt produces inconsistent or unusable results.
- Matching a brand's visual language.

## Workflow

### 1. Extract the brief's decisions

Fill this table before writing any prompt. Ask about anything genuinely missing; do not invent a
brand direction.

| Slot | Example | Why it matters |
|------|---------|----------------|
| Subject | "a ceramic mug on a windowsill" | The literal content |
| Purpose | hero image, 16:9, text overlay on the left | Determines composition and negative space |
| Style | editorial photograph, soft natural light | The largest visual lever |
| Composition | three-quarter view, subject right, negative space left | Prevents unusable crops |
| Lighting | overcast window light, soft shadows | Sets mood and realism |
| Lens / rendering | 50mm, shallow depth of field | Controls perspective and focus |
| Palette | warm neutrals, one muted green accent | Brand consistency |
| Texture | matte ceramic, linen, slight grain | Anti-plastic realism |
| Avoid | text, logos, extra objects, harsh HDR | Prevents recurring defects |

### 2. Write the prompt in a fixed order

Subject → composition → lighting → lens/medium → palette → texture → output constraints.

```
A single matte ceramic mug on a pale oak windowsill, three-quarter view, subject
positioned right of frame, generous empty space on the left for text, soft overcast
window light from the left, 50mm lens at f/2.8, warm neutral palette with one muted
green accent, fine film grain, photorealistic, 16:9
```

Keep the prompt under ~80 words. Beyond that, constraints start to contradict each other and the
model drops some at random.

### 3. Iterate one variable at a time

For each attempt, record: prompt version, the single change, and the result. Stop when the image
meets the brief, not when it is merely acceptable. Keep rejected prompts — they explain why the
final one looks the way it does.

Common fixes:

| Defect | Change |
|--------|--------|
| Subject too centred | State placement explicitly and the negative space requirement |
| Plastic look | Add material and texture words; remove "3D render", "glossy" |
| Text appearing in the image | Add "no text, no lettering" and prefer composition without signage |
| Too busy | Remove adjectives; cut the object list to one subject plus one prop |
| Wrong era or style | Replace the style word with a named photographic or artistic movement plus a reference era |

### 4. Keep a consistency sheet for a series

For a set, freeze the shared slots in a `STYLE.md`:

```
palette: #F4EFE7 #2E2A26 #7C8B6F
lighting: soft overcast, left key
lens: 50mm, f/2.8
texture: fine grain, matte surfaces
avoid: text, logos, saturated colours, HDR
```

Each new prompt reuses the sheet and varies only subject and composition. Reusing the full prompt
text with one word swapped produces drift; reusing the frozen slots produces consistency.

### 5. Verify against the brief

- Aspect ratio and resolution match the placement.
- Negative space exists where text will go.
- No unintended text, logos, watermarks, or extra limbs.
- Palette matches the stated hex values within reason.
- The image still reads at thumbnail size.

## Rules

- Never claim an image is "on brand" without comparing it to the supplied reference.
- Never prompt for a living artist's style by name; describe the visual qualities instead.
- Never generate a recognisable real person, or a brand logo, without authorisation.
- Never present an AI image as a photograph of a real event.
- Do not change more than one variable per iteration when diagnosing.

## Output format

```
BRIEF.md          # the filled decision table
PROMPTS.md        # each version, the single change, and the outcome
STYLE.md          # frozen slots for a series
<images>
```

## Error handling

| Condition | Action |
|-----------|--------|
| Brief has no purpose or placement | Ask; composition cannot be optimised without it |
| Model ignores a constraint repeatedly | Move it to the negative prompt, or restructure so the constraint is easier to satisfy |
| User asks for a specific living artist's style | Offer a description of the visual qualities instead and explain why |
| Series drifts between images | Rebuild from `STYLE.md` rather than editing the previous prompt |

## Example

**Input:** "Something warm for the homepage hero, text goes on the left."
**Output:** a nine-slot brief, a 55-word prompt, three iterations (composition, then lighting,
then texture), a `STYLE.md` for the following four images, and a note that text artefacts were
eliminated by removing signage from the scene.
