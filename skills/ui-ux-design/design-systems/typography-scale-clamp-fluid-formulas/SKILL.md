---
name: typography-scale-clamp-fluid-formulas
description: Constructs fluid typography scales using CSS clamp() formulas that scale smoothly across viewports. Use when eliminating jarring media query font size jumps in responsive design.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/"
---
# Typography Scale Clamp Fluid Formulas

## Overview
Using discrete media queries causes sudden font size jumps on window resizing. CSS clamp() interpolates font sizes smoothly between minimum mobile sizes and maximum desktop sizes using viewport units.

## Operational Workflow

1. **Define min viewport (e.g., 375px), max viewport (e.g., 1440px), min font size, and max font size in rem.**:
   - Define min viewport (e.g., 375px), max viewport (e.g., 1440px), min font size, and max font size in rem.

2. **Calculate linear rate of change slope**:
   - Calculate linear rate of change slope: slope = (maxFontSize - minFontSize) / (maxViewport - minViewport).

3. **Compute intersection Y-offset and construct CSS clamp formula**:
   - Compute intersection Y-offset and construct CSS clamp formula: clamp(min, yAxisIntersection + (slope * 100vw), max).

4. **Apply fluid formulas to design system heading tokens (h1, h2, h3, body).**:
   - Apply fluid formulas to design system heading tokens (h1, h2, h3, body).

## Recommended Tools & Environments
- Fluid Typography
- CSS clamp()
- Typography Scale
- Responsive Design

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
