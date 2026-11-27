---
name: style-dictionary-cross-platform-export
description: Transforms design tokens into platform-specific variables (CSS, SCSS, Android XML, iOS Swift) using Style Dictionary. Use when automating design token compilation in multi-platform systems.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://styledictionary.com/"
---
# Style Dictionary Cross Platform Export

## Overview
Style Dictionary parses token JSON files and compiles them into platform targets (CSS Custom Properties, SCSS variables, iOS Swift structs, Android XML resources) with custom value transforms.

## Operational Workflow

1. **Configure config.json declaring source token glob paths and platform output platforms.**:
   - Configure config.json declaring source token glob paths and platform output platforms.

2. **Define output formats**:
   - Define output formats: css/variables for web, ios-swift/class.swift for iOS, android/resources for Android.

3. **Register custom transforms to convert hex colors to UIColor or rem units to dp/sp.**:
   - Register custom transforms to convert hex colors to UIColor or rem units to dp/sp.

4. **Execute style-dictionary build in CI to generate ready-to-import design token packages.**:
   - Execute style-dictionary build in CI to generate ready-to-import design token packages.

## Recommended Tools & Environments
- Style Dictionary
- Build Tool
- CSS Variables / Swift / XML
- Design Tokens

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
