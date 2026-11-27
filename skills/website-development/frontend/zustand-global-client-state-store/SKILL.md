---
name: zustand-global-client-state-store
description: Manages lightweight global client state and local storage persistence using Zustand stores. Use when building modular client state stores without Redux boilerplate.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://zustand.docs.pmnd.rs/"
---
# Zustand Global Client State Store

## Overview
Redux requires verbose actions and reducers. Zustand provides a minimalist, hook-based state management store with zero boilerplate, supporting atomic state selectors and middleware persistence.

## Operational Workflow

1. **Create store with create<State>() defining state properties and mutating action methods.**:
   - Create store with create<State>() defining state properties and mutating action methods.

2. **Attach persist middleware to automatically synchronize store state with browser localStorage.**:
   - Attach persist middleware to automatically synchronize store state with browser localStorage.

3. **Consume state in React components using atomic selectors**:
   - Consume state in React components using atomic selectors: const count = useStore((state) => state.count).

4. **Execute state updates outside of React component lifecycles when needed via useStore.getState().**:
   - Execute state updates outside of React component lifecycles when needed via useStore.getState().

## Recommended Tools & Environments
- Zustand
- React State Management
- LocalStorage Persistence
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
