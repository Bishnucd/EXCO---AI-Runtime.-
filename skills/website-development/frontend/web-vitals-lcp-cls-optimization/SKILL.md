---
name: web-vitals-lcp-cls-optimization
description: Audits and optimizes Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift, Interaction to Next Paint). Use when optimizing web page performance for speed and SEO rankings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://web.dev/articles/vitals"
---
# Web Vitals Lcp Cls Optimization

## Overview
Core Web Vitals directly determine search engine ranking and user bounce rates. Eliminating render-blocking resources, preloading hero images, and reserving layout aspect ratios achieves top scores.

## Operational Workflow

1. **Measure LCP, CLS, and INP metrics using Chrome User Experience Report (CrUX) and Lighthouse.**:
   - Measure LCP, CLS, and INP metrics using Chrome User Experience Report (CrUX) and Lighthouse.

2. **Optimize LCP**:
   - Optimize LCP: add <link rel="preload" as="image"> to hero assets and inline critical above-the-fold CSS.

3. **Eliminate CLS**:
   - Eliminate CLS: declare explicit width/height or aspect-ratio on all image and ad elements.

4. **Improve INP**:
   - Improve INP: break up long JavaScript tasks (> 50ms) using scheduler.yield() or requestIdleCallback.

## Recommended Tools & Environments
- Core Web Vitals
- Chrome DevTools
- Lighthouse
- JavaScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
