---
name: microinteraction-motion-curve-specification
description: Defines standardized cubic-bezier easing curves and duration tokens for cohesive UI animations. Use when crafting polished microinteractions and transitions in design systems.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://m3.material.io/styles/motion/easing-and-duration/tokens-specs"
---
# Microinteraction Motion Curve Specification

## Overview
Linear animations feel robotic. Specifying standardized easing curves (Standard, Decelerate for entrances, Accelerate for exits) and duration tokens (150ms–300ms) creates natural, responsive physics.

## Operational Workflow

1. **Define easing curve tokens**:
   - Define easing curve tokens: ease-standard (cubic-bezier(0.2, 0, 0, 1)), ease-decelerate, ease-accelerate.

2. **Define duration tokens**:
   - Define duration tokens: duration-fast (150ms for hovers), duration-normal (250ms for modals), duration-slow (400ms).

3. **Apply easing tokens to CSS transition properties (e.g., transition**:
   - Apply easing tokens to CSS transition properties (e.g., transition: transform var(--duration-fast) var(--ease-standard)).

4. **Respect user system preferences by wrapping animations in @media (prefers-reduced-motion**:
   - Respect user system preferences by wrapping animations in @media (prefers-reduced-motion: reduce).

## Recommended Tools & Environments
- Motion Design
- Cubic-Bezier Easing
- Microinteractions
- Design Tokens

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
