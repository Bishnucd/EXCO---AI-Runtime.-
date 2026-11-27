---
name: storybook-component-catalog-documentation
description: Documents UI component variants, states, and accessibility props with Storybook and MDX. Use when maintaining interactive component catalogs for engineering and design teams.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://storybook.js.org/docs"
---
# Storybook Component Catalog Documentation

## Overview
Storybook provides an isolated sandbox to develop, test, and document UI components outside of application business logic, rendering every visual state (hover, disabled, loading) interactively.

## Operational Workflow

1. **Create component story file**:
   - Create component story file: Button.stories.tsx defining Meta and StoryObj configurations.

2. **Define argTypes with controls for interactive prop tweaking in Storybook UI.**:
   - Define argTypes with controls for interactive prop tweaking in Storybook UI.

3. **Render stories for all key component variants**:
   - Render stories for all key component variants: Primary, Secondary, Destructive, Disabled, Loading.

4. **Attach automated accessibility addon (@storybook/addon-a11y) to verify WCAG compliance per story.**:
   - Attach automated accessibility addon (@storybook/addon-a11y) to verify WCAG compliance per story.

## Recommended Tools & Environments
- Storybook
- React / Vue
- Component Driven Development (CDD)
- MDX

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
