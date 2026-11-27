---
name: query-performance-tuning
description: Diagnoses a slow SQL query using its execution plan, identifying the actual bottleneck (missing index, bad row estimate, N+1, sort spill, or lock contention) and proposing a verified fix. Use when a query or endpoint is slow, when a plan shows a sequential scan, or when an index did not help as expected.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Query Performance Tuning

Read the plan, find the actual cost, fix the cause. Guessing at indexes is how databases end up
with nine of them and no speed-up.

## When to use

- A query or endpoint is slower than its budget.
- A plan shows a sequential scan on a large table.
- An index was added and nothing improved.
- A query got slower after a data-volume increase.

## Workflow

### 1. Capture the real query and its plan

Get the exact statement as executed, with parameter values — not the ORM's template.

```sql
-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) <query>;

-- MySQL
EXPLAIN ANALYZE <query>;
```

Rules:
- Always `ANALYZE`; a plan without actual timings is a guess.
- Always include `BUFFERS` on Postgres; it reveals I/O that timing hides.
- Use realistic parameter values. A query fast for one tenant may be slow for another.

### 2. Find the dominant node

Work down the plan and find where actual time is spent, not where the planner guessed it would
be. Compare `rows=` (estimated) with `actual rows=` at each node.

| Symptom | Likely cause |
|---------|--------------|
| `actual rows` differs from `rows` by >10× | Stale or insufficient statistics; bad estimate cascades |
| `Seq Scan` on a large table with a selective filter | Missing or unusable index |
| `Index Scan` with many heap fetches | Low correlation or a non-covering index |
| `Sort` with `external merge Disk` | `work_mem` too low, or sorting more rows than needed |
| Nested loop over many rows | Missing index on the inner side, or a bad estimate choosing the wrong join |
| High `Buffers: shared read` | Data not cached; consider the working set size |
| Time in `Lock` waits | Contention, not query shape |

### 3. Form one hypothesis at a time

State it as a testable claim: "The filter on `orders.created_at` has no index, so the plan scans
4.1M rows to return 300."

Change one thing. Re-run `EXPLAIN ANALYZE`. Record before/after time, buffers, and plan shape.
If the change does not help, revert it — do not stack a second guess on top.

### 4. Prefer the cheapest effective fix, in order

1. **Reduce rows earlier** — push the filter down, avoid `SELECT *`, remove a needless join.
2. **Fix statistics** — `ANALYZE` the table; consider a larger statistics target on skewed
   columns; use extended statistics for correlated columns.
3. **Add the right index** — composite index ordered by equality columns first, then the range
   column; include selected columns for a covering index.
4. **Rewrite the query** — replace `OR` with `UNION ALL` where appropriate, use `EXISTS` over
   `IN (subquery)`, avoid functions on indexed columns (`WHERE lower(email) = ...` needs an
   expression index).
5. **Change the schema** — denormalise a hot aggregate, add a summary table, partition a huge
   table.
6. **Change the engine or cache** — last, and only with evidence.

### 5. Check for N+1 at the application layer

A single fast query repeated 400 times is an N+1 problem. Look for a loop issuing queries, or
an ORM lazy-loading a relation. Fix with a join, a batched `IN` query, or a dataloader.

### 6. Verify

- Same result set before and after (row count and a checksum).
- p50 and p95 latency under realistic concurrency, not just single-query time.
- Write-path impact: a new index slows inserts. Measure it.
- Confirm the index is actually used (`pg_stat_user_indexes`, `EXPLAIN`).

## Rules

- Never add an index without naming the query it serves.
- Never drop an index without checking `pg_stat_user_indexes.idx_scan` and asking the owner.
- Never tune against a dataset that is orders of magnitude smaller than production.
- Never use `SELECT *` in a hot path.
- Do not use `OFFSET` for deep pagination; use keyset pagination.
- Do not cache to hide a query that could be fixed.

## Output format

```markdown
## Query
<statement, with parameters>

## Before
Plan shape, dominant node, actual time, buffers, rows examined

## Root cause
<one sentence>

## Change
<the exact DDL or query rewrite>

## After
Plan shape, actual time, buffers, rows examined

## Verification
- result set identical: yes/no
- p95 under concurrency: <before> → <after>
- write-path impact: <measurement>

## Not changed, and why
<indexes considered and rejected>
```

## Error handling

| Condition | Action |
|-----------|--------|
| No permission to run `EXPLAIN ANALYZE` | Request it; a plan without `ANALYZE` cannot be tuned reliably |
| Plan differs between parameter values | Report both plans; the fix must work for the worst case |
| Query is slow only under concurrency | Suspect locks or connection-pool exhaustion; collect `pg_stat_activity` |
| Statistics are fresh and estimates still wrong | Check for correlated columns and consider extended statistics |

## Example

**Input:** dashboard query, 4.2s p95.
**Output:** root cause was a `Seq Scan` on `events` because `lower(email)` defeated the index;
replaced with an expression index; 4.2s → 38ms, buffers read 210k → 900, insert cost +3%.
