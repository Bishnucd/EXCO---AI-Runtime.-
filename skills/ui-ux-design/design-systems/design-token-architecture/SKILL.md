---
name: design-token-architecture
description: Defines, structures, and transforms cross-platform design tokens (color, spacing, typography, elevation) following W3C Design Tokens Community Group specifications. Use when establishing design systems and syncing design tokens between Figma and frontend codebases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://design-tokens.github.io/community-group/format/"
---

# Design Token Architecture

## Overview
Design tokens are the atomic visual attributes of a design system (colors, spacing units, typography scales, border radii, shadows) stored in platform-agnostic format (JSON). This skill provides guidelines for structuring three-tier token taxonomies (global, semantic, component) and compiling them into target platform assets (CSS variables, SCSS, Tailwind config, Swift, Android XML).

## Operational Workflow

1. **Three-Tier Taxonomy Structure**:
   - **Tier 1: Global / Reference Tokens**: Raw visual values with no context (e.g. `color.blue.500: #3b82f6`, `space.4: 16px`).
   - **Tier 2: Semantic / Alias Tokens**: Purpose-driven decisions that reference global tokens and support theming (e.g. `color.background.primary: {color.neutral.50}`, `color.text.interactive: {color.blue.500}`).
   - **Tier 3: Component Tokens**: Specific to component scopes (e.g. `button.primary.background: {color.interactive.brand}`).

2. **W3C Format Specification Compliance**:
   - Use `$value`, `$type`, and `$description` properties adhering to the W3C DTCG draft standard:
     ```json
     {
       "color": {
         "brand": {
           "primary": {
             "$value": "#2563eb",
             "$type": "color",
             "$description": "Primary interactive brand color"
           }
         }
       }
     }
     ```

3. **Accessibility & Contrast Verification**:
   - Verify that all semantic text/background color token pairs satisfy WCAG 2.1 Level AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text).
   - Define dedicated high-contrast and dark-mode override token sets.

4. **Build and Transformation Pipeline**:
   - Use Style Dictionary or Token Transformer to compile JSON token files into platform targets:
     - Web: CSS Custom Properties (`--color-brand-primary: #2563eb;`) and Tailwind CSS plugins.
     - iOS: Swift Structs and SwiftUI Color assets.
     - Android: XML resources and Jetpack Compose Themes.
