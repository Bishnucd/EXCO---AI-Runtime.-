---
name: virtualized-infinite-scroll-tanstack-virtual
description: Renders 100,000 tabular rows smoothly with 60 FPS scrolling using TanStack Virtual. Use when rendering massive datasets without crashing browser DOM memory.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://tanstack.com/virtual/latest"
---
# Virtualized Infinite Scroll Tanstack Virtual

## Overview
Rendering 10,000 DOM nodes freezes browser rendering. TanStack Virtual measures scroll position and renders only the 20–30 items currently visible in the viewport with absolute positioning.

## Operational Workflow

1. **Initialize row virtualizer**:
   - Initialize row virtualizer: const rowVirtualizer = useVirtualizer({ count: items.length, getScrollElement, estimateSize: () => 40 }).

2. **Render scroll container with total virtual height**:
   - Render scroll container with total virtual height: style={{ height: `${rowVirtualizer.getTotalSize()}px` }}.

3. **Map exclusively over rowVirtualizer.getVirtualItems(), positioning each item with transform translateY.**:
   - Map exclusively over rowVirtualizer.getVirtualItems(), positioning each item with transform translateY.

4. **Benchmark memory footprint**:
   - Benchmark memory footprint: verify DOM maintains steady ~30 node count even with 500,000 data rows.

## Recommended Tools & Environments
- TanStack Virtual
- DOM Virtualization
- Infinite Scrolling
- Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
