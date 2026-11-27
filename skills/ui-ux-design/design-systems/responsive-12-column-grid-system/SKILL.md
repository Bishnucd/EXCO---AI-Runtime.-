---
name: responsive-12-column-grid-system
description: Designs fluid, breakpoint-responsive 12-column grid layouts with flexible gutter and margin tokens. Use when structuring consistent page layouts across mobile, tablet, and desktop.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Grid_(graphic_design)"
---
# Responsive 12 Column Grid System

## Overview
A 12-column grid provides maximum layout flexibility because 12 divides evenly by 2, 3, 4, and 6. Standardizing column widths, gutters, and page margins ensures visual harmony across screen sizes.

## Operational Workflow

1. **Define standard breakpoint tokens**:
   - Define standard breakpoint tokens: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).

2. **Specify column counts per breakpoint**:
   - Specify column counts per breakpoint: 4 columns for mobile, 8 for tablet, 12 for desktop.

3. **Set fluid gutter spacing tokens (16px on mobile, 24px on tablet, 32px on desktop).**:
   - Set fluid gutter spacing tokens (16px on mobile, 24px on tablet, 32px on desktop).

4. **Implement responsive CSS Grid classes**:
   - Implement responsive CSS Grid classes: display: grid; grid-template-columns: repeat(12, 1fr).

## Recommended Tools & Environments
- CSS Grid / Flexbox
- 12-Column Layout
- Responsive Breakpoints
- Design System

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
