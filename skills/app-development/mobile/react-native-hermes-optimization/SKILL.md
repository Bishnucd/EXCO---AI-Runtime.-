---
name: react-native-hermes-optimization
description: Configures and profiles the Hermes JavaScript engine and bytecode compilation for React Native apps. Use when optimizing mobile app startup time, memory footprint, and frame rates.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://reactnative.dev/docs/hermes"
---
# React Native Hermes Optimization

## Overview
Hermes is an open-source JavaScript engine optimized for running React Native. It precompiles JavaScript into bytecode at build time, slashing Time to Interactive (TTI) and memory consumption.

## Operational Workflow

1. **Enable hermesEnabled in android/app/build.gradle and Podfile for iOS target compilation.**:
   - Enable hermesEnabled in android/app/build.gradle and Podfile for iOS target compilation.

2. **Configure Metro bundler to emit optimized bytecode bundles during production builds.**:
   - Configure Metro bundler to emit optimized bytecode bundles during production builds.

3. **Capture sampling profiler traces from running devices and analyze flamegraphs in DevTools.**:
   - Capture sampling profiler traces from running devices and analyze flamegraphs in DevTools.

4. **Eliminate costly main-thread blocking operations and unnecessary re-renders.**:
   - Eliminate costly main-thread blocking operations and unnecessary re-renders.

## Recommended Tools & Environments
- React Native
- Hermes Engine
- Flipper / Chrome DevTools
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
