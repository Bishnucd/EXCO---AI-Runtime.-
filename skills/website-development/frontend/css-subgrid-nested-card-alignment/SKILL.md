---
name: css-subgrid-nested-card-alignment
description: Aligns card headers, footers, and content tracks across responsive grid rows using CSS Subgrid. Use when eliminating awkward ragged card layouts in modern web designs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid"
---
# Css Subgrid Nested Card Alignment

## Overview
Without subgrid, variable card description lengths push card footers out of alignment. CSS Subgrid allows child card components to inherit parent grid row tracks, aligning all footers perfectly.

## Operational Workflow

1. **Define parent grid container with grid-template-columns**:
   - Define parent grid container with grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)).

2. **Configure card component to span 3 rows**:
   - Configure card component to span 3 rows: grid-row: span 3; display: grid; grid-template-rows: subgrid.

3. **Place header in row 1, description in row 2, and action footer in row 3 across all cards.**:
   - Place header in row 1, description in row 2, and action footer in row 3 across all cards.

4. **Observe all card action buttons snap to identical horizontal alignment regardless of text length.**:
   - Observe all card action buttons snap to identical horizontal alignment regardless of text length.

## Recommended Tools & Environments
- CSS Subgrid
- CSS Grid
- Card Layout Alignment
- Responsive Web Design

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
