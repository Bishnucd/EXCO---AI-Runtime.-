---
name: chartjs-canvas-performance-optimization
description: Optimizes HTML5 canvas chart rendering for dense datasets using Chart.js decimation and parsing flags. Use when eliminating browser lag when graphing 50,000+ data points.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.chartjs.org/docs/latest/general/performance.html"
---
# Chartjs Canvas Performance Optimization

## Overview
Rendering raw high-frequency data locks browser UI threads. Chart.js performance optimization applies Largest-Triangle-Three-Buckets (LTTB) decimation, disabled animations, and normalized coordinates.

## Operational Workflow

1. **Enable Chart.js decimation plugin with algorithm set to lttb (Largest Triangle Three Buckets).**:
   - Enable Chart.js decimation plugin with algorithm set to lttb (Largest Triangle Three Buckets).

2. **Set parsing**:
   - Set parsing: false and normalized: true to bypass internal dataset pre-processing overhead.

3. **Disable initial and update animations for immediate instant-render frame rates.**:
   - Disable initial and update animations for immediate instant-render frame rates.

4. **Benchmark rendering frame time in Chrome DevTools to ensure steady 60 FPS scrolling.**:
   - Benchmark rendering frame time in Chrome DevTools to ensure steady 60 FPS scrolling.

## Recommended Tools & Environments
- Chart.js
- HTML5 Canvas
- LTTB Decimation
- Browser Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
