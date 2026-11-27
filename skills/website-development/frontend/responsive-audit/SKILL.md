---
name: responsive-audit
description: Audits a web page across viewport widths and input types for overflow, tap-target size, text scaling, safe-area handling, and layout shift, then returns a prioritised defect list with reproduction widths and concrete CSS fixes. Use when a layout breaks on mobile, when preparing a release, or when reviewing responsive behaviour of a page or component.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Responsive Audit

A structured sweep, not a vibe check. Every finding has a reproduction width, an observed
symptom, a measured value where possible, and a fix.

## When to use

- A page is reported broken on a specific phone or browser.
- Pre-release check before shipping a marketing page or app shell.
- Reviewing a component that will be reused at unknown widths.

Not for fixing a single known bug — go straight to the fix.

## Test matrix

Run at minimum these widths, in this order:

| Width | Represents |
|-------|------------|
| 320 | Smallest common phone (iPhone SE 1st gen, Galaxy Fold outer) |
| 360 | Common Android |
| 390 | iPhone 14/15 logical width |
| 768 | Tablet portrait |
| 1024 | Tablet landscape / small laptop |
| 1280 | Laptop |
| 1440 | Desktop |
| 1920 | Large desktop |

Also test: 200% browser zoom at 1280, and landscape orientation at 667×375.

## Workflow

### 1. Overflow sweep

At each width, run in the console:

```js
const docW = document.documentElement.clientWidth;
[...document.querySelectorAll("body *")]
  .filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && (r.right > docW + 1 || r.left < -1);
  })
  .slice(0, 25)
  .forEach(el => {
    const r = el.getBoundingClientRect();
    console.log(el.tagName, el.className, Math.round(r.left), Math.round(r.right), docW);
  });
```

Also check `document.documentElement.scrollWidth > docW` for horizontal scroll. Report the
deepest offending element, not its ancestors.

### 2. Tap targets

```js
[...document.querySelectorAll("a,button,input,select,[role=button]")]
  .map(el => ({ el, r: el.getBoundingClientRect() }))
  .filter(({ r }) => r.width > 0 && (r.width < 44 || r.height < 44))
  .slice(0, 30)
  .forEach(({ el, r }) => console.log(Math.round(r.width), Math.round(r.height), el.textContent.trim().slice(0, 40)));
```

Flag anything under 44×44 CSS px that is not an inline text link inside a paragraph.

### 3. Text scaling and truncation

- Zoom to 200%: nothing should clip or overlap.
- Set `html { font-size: 200% }`: check for fixed-height containers that clip.
- Look for `-webkit-line-clamp`, `overflow: hidden`, and fixed `height` on text blocks.

### 4. Safe areas and viewport units

- Confirm `viewport-fit=cover` plus `env(safe-area-inset-*)` padding on fixed headers and
  footers.
- Replace `100vh` with `100dvh` (or `svh`) for full-height sections; note that `100vh`
  overflows on mobile browser chrome.

### 5. Layout shift

Measure with a PerformanceObserver:

```js
new PerformanceObserver(list => {
  for (const e of list.getEntries()) {
    if (!e.hadRecentInput) console.log("CLS", e.value.toFixed(4), e.sources?.map(s => s.node?.tagName));
  }
}).observe({ type: "layout-shift", buffered: true });
```

Attribute shifts to images without dimensions, late-loading fonts, injected banners, or
`position: sticky` headers changing height.

### 6. Fix and verify

Apply the smallest fix per defect. Re-run the same script at the same width. Record
before/after.

## Rules

- One defect, one entry. Do not bundle unrelated fixes.
- Prefer intrinsic layout (`min()`, `clamp()`, `flex-wrap`, `grid auto-fit`) over new
  breakpoints. Only add a breakpoint when content genuinely changes, not to paper over a
  missing `min-width: 0`.
- Never fix overflow with `overflow-x: hidden` on `body` unless you also state what is
  being clipped.
- Do not report a defect you could not reproduce; mark it "unconfirmed".

## Severity

| Level | Meaning |
|-------|---------|
| P0 | Content unreachable or page unusable at a common width |
| P1 | Visible breakage, horizontal scroll, or a control that cannot be tapped |
| P2 | Degraded but usable: cramped spacing, awkward wrap, minor clipping |
| P3 | Polish: inconsistent alignment, non-ideal but harmless |

## Output format

```markdown
## Summary
<one paragraph: widths tested, defect counts by severity>

## Defects
### P1 – Pricing table overflows at 320px
- Widths: 320, 360
- Element: `.pricing-grid` (3rd card, right edge 412px vs viewport 320px)
- Cause: fixed `min-width: 360px` on cards inside a non-wrapping grid
- Fix: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))`
- Verified: re-ran overflow sweep at 320 — no offenders

## Not reproducible
- <item> — seen once on device, could not reproduce in emulation
```

## Error handling

| Condition | Action |
|-----------|--------|
| No browser automation available | Ask the user for screenshots at the matrix widths and audit those; state the limitation |
| Page requires auth | Audit the reachable public pages; list unaudited areas explicitly |
| Third-party widget causes overflow | Report it, and give a wrapper constraint rather than patching vendor CSS |

## Example

**Input:** landing page, mobile complaints.
**Output:** 9 defects — 1×P0 (nav drawer cannot close under 360px), 3×P1, 4×P2, 1×P3;
each with width, element, cause, fix, and verification note.
