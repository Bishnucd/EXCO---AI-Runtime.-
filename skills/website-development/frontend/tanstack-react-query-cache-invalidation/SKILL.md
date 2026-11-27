---
name: tanstack-react-query-cache-invalidation
description: Manages server state, optimistic updates, and smart cache invalidation using TanStack React Query. Use when eliminating redundant API fetches and keeping UI in sync with backend data.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation"
---
# Tanstack React Query Cache Invalidation

## Overview
Managing server data in global client stores causes stale data bugs. TanStack Query manages caching, automatic background refetching on window focus, and optimistic mutation rollbacks.

## Operational Workflow

1. **Fetch data using useQuery({ queryKey**:
   - Fetch data using useQuery({ queryKey: ["todos"], queryFn: fetchTodos }).

2. **Implement data mutations with useMutation({ mutationFn**:
   - Implement data mutations with useMutation({ mutationFn: updateTodo }).

3. **Configure optimistic updates**:
   - Configure optimistic updates: update local query cache immediately in onMutate before server responds.

4. **Invalidate queries on completion**:
   - Invalidate queries on completion: queryClient.invalidateQueries({ queryKey: ["todos"] }) to refetch fresh state.

## Recommended Tools & Environments
- TanStack Query
- React Query
- Server State Management
- Cache Invalidation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
