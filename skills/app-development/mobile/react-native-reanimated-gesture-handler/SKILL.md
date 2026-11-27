---
name: react-native-reanimated-gesture-handler
description: Implements 60fps gesture-driven animations running on the native UI thread using React Native Reanimated. Use when crafting swipeable cards, bottom sheets, and interactive mobile gestures.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.swmansion.com/react-native-reanimated/"
---
# React Native Reanimated Gesture Handler

## Overview
JavaScript-driven animations drop frames during heavy CPU tasks. Reanimated executes animation worklets directly on the native mobile UI thread, ensuring butter-smooth 60/120fps interactions.

## Operational Workflow

1. **Configure GestureHandlerRootView and wrap interactive components with GestureDetector.**:
   - Configure GestureHandlerRootView and wrap interactive components with GestureDetector.

2. **Define animated shared values (useSharedValue) representing translation and scale states.**:
   - Define animated shared values (useSharedValue) representing translation and scale states.

3. **Author gesture callbacks running on UI worklet threads (withSpring, withTiming).**:
   - Author gesture callbacks running on UI worklet threads (withSpring, withTiming).

4. **Apply useAnimatedStyle to map shared values directly to native transform matrices.**:
   - Apply useAnimatedStyle to map shared values directly to native transform matrices.

## Recommended Tools & Environments
- React Native Reanimated v3
- Gesture Handler
- Worklets
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
