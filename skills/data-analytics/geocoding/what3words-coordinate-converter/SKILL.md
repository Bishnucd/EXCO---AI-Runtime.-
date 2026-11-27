---
name: what3words-coordinate-converter
description: Converts between GPS coordinates and unique 3-word geographic address identifiers using the what3words API. Use when referencing precise 3m x 3m ground locations in remote areas.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.what3words.com/public-api/docs"
---
# What3words Coordinate Converter

## Overview
Rural areas and construction sites lack street addresses. what3words divides the planet into 57 trillion 3m x 3m squares, assigning each square a memorable 3-word combination (e.g. ///filled.count.soap).

## Operational Workflow

1. **Call convert-to-coordinates endpoint passing 3-word address string.**:
   - Call convert-to-coordinates endpoint passing 3-word address string.

2. **Extract returned WGS84 latitude, longitude, and country boundary codes.**:
   - Extract returned WGS84 latitude, longitude, and country boundary codes.

3. **Reverse convert**:
   - Reverse convert: pass GPS coordinates to convert-to-3wa endpoint to generate 3-word labels.

4. **Display 3-word identifier alongside map coordinates on mobile dispatch screens.**:
   - Display 3-word identifier alongside map coordinates on mobile dispatch screens.

## Recommended Tools & Environments
- what3words API
- REST
- GPS Coordinates
- TypeScript / Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
