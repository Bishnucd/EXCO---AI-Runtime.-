---
name: vite-code-splitting-manual-chunks-tuning
description: Optimizes Vite/Rollup production bundles with manualChunks vendor splitting and dynamic import routes. Use when reducing initial page load bundles and eliminating vendor duplication.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://vitejs.dev/guide/build.html#chunking-strategy"
---
# Vite Code Splitting Manual Chunks Tuning

## Overview
A monolithic vendor bundle forces users to re-download the entire application whenever any single dependency changes. manualChunks isolates rarely changing libraries (React, Lodash) into long-cached chunks.

## Operational Workflow

1. **Configure build.rollupOptions.output.manualChunks in vite.config.ts.**:
   - Configure build.rollupOptions.output.manualChunks in vite.config.ts.

2. **Group core vendor packages into isolated chunks**:
   - Group core vendor packages into isolated chunks: vendor-react: ["react", "react-dom"], vendor-charts: ["chart.js"].

3. **Implement dynamic imports for route components**:
   - Implement dynamic imports for route components: const Settings = React.lazy(() => import("./Settings")).

4. **Analyze final bundle distribution using rollup-plugin-visualizer to verify clean chunk separation.**:
   - Analyze final bundle distribution using rollup-plugin-visualizer to verify clean chunk separation.

## Recommended Tools & Environments
- Vite
- Rollup manualChunks
- Code Splitting
- Web Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
