---
name: polyline6-encoded-path-compression
description: Compresses coordinate path arrays into compact ASCII strings using Google Encoded Polyline Algorithm Format (Polyline6). Use when transmitting multi-thousand point route geometries over HTTP.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/maps/documentation/utilities/polylinealgorithm"
---
# Polyline6 Encoded Path Compression

## Overview
Transmitting arrays of thousands of float coordinates consumes megabytes of JSON bandwidth. The polyline algorithm computes delta offsets and encodes coordinates into compact ASCII strings.

## Operational Workflow

1. **Multiply coordinate floats by precision scaling factor (1e5 for 5 decimals, 1e6 for 1-meter accuracy).**:
   - Multiply coordinate floats by precision scaling factor (1e5 for 5 decimals, 1e6 for 1-meter accuracy).

2. **Compute delta differences between consecutive coordinate integers.**:
   - Compute delta differences between consecutive coordinate integers.

3. **Convert deltas to two's complement binary, chunk into 5-bit groups, and shift by ASCII 63.**:
   - Convert deltas to two's complement binary, chunk into 5-bit groups, and shift by ASCII 63.

4. **Decode polyline string back to coordinate array on frontend client map renderers.**:
   - Decode polyline string back to coordinate array on frontend client map renderers.

## Recommended Tools & Environments
- Polyline Algorithm (5 & 6 decimals)
- Data Compression
- Python / JavaScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
