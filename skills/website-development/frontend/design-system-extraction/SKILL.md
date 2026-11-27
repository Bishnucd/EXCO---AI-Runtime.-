---
name: design-system-extraction
description: Extracts a reusable design system (colour, type, spacing, radius, shadow, motion tokens) from a live site or screenshot set and emits CSS custom properties plus a Tailwind theme. Use when the user wants to match an existing product's visual language, rebuild a UI from screenshots, or turn ad-hoc styles into tokens.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Design System Extraction

Turn an existing interface into named tokens. The output is a small set of primitive
values, a semantic layer that references them, and a mapping to whatever styling system
the target project already uses.

## When to use

- Rebuilding a page or app to match a reference product.
- A codebase has 40 hard-coded hex values and the user wants them consolidated.
- Onboarding a design into Tailwind, CSS variables, or a component library.

Do not use this skill to invent a new visual identity. That is design work, not extraction.

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Reference | yes | Live URL, local build, Figma export, or 3+ screenshots |
| Target stack | yes | Plain CSS, Tailwind v3/v4, CSS-in-JS, or a design-tool format |
| Brand constraints | no | Colours or fonts that must be preserved verbatim |

If the only input is a single screenshot, say so and mark every derived value as
low-confidence; a single image cannot reveal hover, focus, or responsive states.

## Workflow

### 1. Collect raw values

For a live page, run this in the browser console to sample computed styles:

```js
const props = ["color","backgroundColor","fontFamily","fontSize","fontWeight",
  "lineHeight","letterSpacing","padding","margin","gap","borderRadius",
  "boxShadow","borderColor","transitionDuration"];
const tally = {};
for (const el of document.querySelectorAll("body *")) {
  const cs = getComputedStyle(el);
  for (const p of props) {
    const v = cs[p];
    if (!v || v === "none" || v === "normal" || v === "0px") continue;
    (tally[p] ??= {})[v] = ((tally[p] ??= {})[v] || 0) + 1;
  }
}
for (const [p, m] of Object.entries(tally)) {
  console.log(p, Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8));
}
```

Record counts, not just values. A colour used 300 times is a token; a colour used once
is probably an artefact.

### 2. Normalise into primitives

- **Colour:** convert to OKLCH where the target supports it, otherwise hex. Snap near
  duplicates (within ~2% perceptual distance) to one value and note the merge.
- **Type:** build a scale from distinct `fontSize`/`lineHeight` pairs. Keep the ratio;
  do not invent a modular scale the source does not use.
- **Spacing:** collect distinct paddings/margins/gaps, find the base unit (usually 4px or
  8px), and express as multiples.
- **Radius, shadow, motion:** one scale each, ordered by magnitude.

### 3. Name semantically

Use three layers and never skip the middle one:

```
--color-blue-600        (primitive: what it is)
--color-action-primary  (semantic: what it means)
--button-bg             (component: where it is used)
```

Name by role (`surface`, `text-muted`, `border-subtle`, `action-primary`, `danger`) rather
than appearance (`light-gray-2`). If a value has no clear role, leave it in the primitive
layer only.

### 4. Emit the artefacts

Produce all three, in this order:

1. `tokens.css` – `:root` primitives and semantics, plus a `[data-theme="dark"]` block if
   the reference has dark mode.
2. `tailwind.config.js` (or the v4 `@theme` block) mapping semantic names to primitives.
3. `TOKENS.md` – a table of token, value, role, usage count, and confidence.

### 5. Prove it

Apply the tokens to one real component from the reference and compare side by side at the
same viewport. Report any visual difference over 2px or one colour step.

## Rules

- Never emit a token with a single usage and no semantic meaning; keep it as a raw value.
- Never rename a brand colour that the user said must be preserved.
- Do not add a dark theme unless the reference has one. Inventing one is out of scope.
- Every emitted value must be traceable to a sampled value or an explicit user decision.
- Contrast: check each text/background semantic pair against WCAG AA (4.5:1 body,
  3:1 large). Report failures; do not silently adjust brand colours.

## Output format

```
tokens.css
tailwind.config.js  (or theme.css for Tailwind v4)
TOKENS.md
```

`TOKENS.md` must start with a one-paragraph summary: how many raw values were found, how
many survived as tokens, and which merges were judgement calls.

## Error handling

| Condition | Action |
|-----------|--------|
| Page is behind auth or a paywall | Ask for a screenshot set or a local build; do not attempt to bypass |
| Styles are injected by JS after load | Wait for network idle, then sample; note the timing |
| Fonts are proprietary and not licensed for reuse | Extract metrics only, and flag the licence question to the user |
| Fewer than 3 distinct values in a category | Report "no system present" instead of inventing one |

## Example

**Input:** marketing site, Tailwind target.
**Output:** 6 colour primitives → 14 semantic tokens; 5 type steps; 8 spacing steps;
`tokens.css`, `tailwind.config.js`, `TOKENS.md` noting that two near-identical grays were
merged and that the primary CTA fails AA at 3.1:1.
