---
name: schema-migration-safety
description: Plans and reviews database schema migrations using expand-and-contract, with a lock analysis, backfill strategy, rollback path, and zero-downtime ordering. Use when changing a table that serves live traffic, renaming or dropping a column, adding a constraint, or reviewing a migration before deploy.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Schema Migration Safety

The migration is the easy part. The hard part is that old code keeps running while the new
schema is applied.

## When to use

- Any schema change on a table with live traffic.
- Renaming or dropping a column or table.
- Adding a NOT NULL constraint or a foreign key to a populated table.
- Reviewing someone else's migration.

## Workflow

### 1. Establish the constraint set

Record:

- Database engine and version (locking behaviour differs).
- Table size (rows, bytes) and write rate.
- Replication topology and lag tolerance.
- Deployment model: can old and new code run simultaneously?
- Acceptable maintenance window, if any.

### 2. Classify the change

| Change | Risk | Approach |
|--------|------|----------|
| Add nullable column, no default | Low | Single migration |
| Add column with default | Engine-dependent | Check whether the engine rewrites the table |
| Add index | Medium | Concurrent index build where supported |
| Rename column | High | Expand-and-contract, never a bare rename |
| Change type | High | New column, dual-write, backfill, cut over |
| Add NOT NULL | High | Backfill, then add as validated constraint |
| Drop column | High | Stop reading, deploy, wait, then drop |
| Add foreign key | High | Validate existing data first, then add NOT VALID and validate |

### 3. Use expand-and-contract for anything breaking

Five deploys, in order:

1. **Expand** — add the new nullable column or table. Nothing reads it yet.
2. **Dual-write** — application writes both old and new. Reads still use old.
3. **Backfill** — copy existing rows in batches, idempotently, with progress tracking.
4. **Switch reads** — application reads new, still writes both.
5. **Contract** — stop writing old, then drop it in a later deploy after a safety window.

Each step must be independently deployable and reversible.

### 4. Analyse locks

For each statement, state the lock it takes and for how long:

- `ALTER TABLE ... ADD COLUMN ... DEFAULT` — on older engines this rewrites the table; on
  newer ones it is metadata-only for non-volatile defaults.
- `CREATE INDEX` without `CONCURRENTLY` blocks writes.
- `ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY` takes a `SHARE ROW EXCLUSIVE` lock and
  validates every row.
- `SET NOT NULL` requires a full scan.
- `VACUUM FULL` takes an `ACCESS EXCLUSIVE` lock.

Set `lock_timeout` and `statement_timeout` in the migration so a blocked statement fails fast
rather than queueing every subsequent query behind it.

### 5. Backfill in batches

```
batch size = rows such that each batch runs under ~1s
loop until 0 rows updated:
  UPDATE target SET new_col = <expr>
  WHERE id IN (SELECT id FROM target WHERE new_col IS NULL ORDER BY id LIMIT :n)
```

- Idempotent: rerunning must not change results.
- Throttled: sleep between batches; watch replication lag.
- Resumable: progress is observable from the data itself, not from a log.
- Never backfill in the same transaction as a schema change.

### 6. Write the rollback

For each step, state how to undo it and what data would be lost. If the answer is "restore
from backup", say how long that takes and what the data loss window is. A migration without a
rollback plan is not ready.

### 7. Test on a production-shaped copy

Run the full sequence against a copy with realistic row counts. Measure duration and lock
waits. A migration that takes 40 seconds on 1,000 rows may take hours on 40 million.

## Rules

- Never drop a column in the same deploy that stops writing it.
- Never run a blocking index build on a large live table without a stated window.
- Never put a data backfill and a DDL change in one transaction on a large table.
- Never use `SELECT *` in a migration; name columns.
- Always set `lock_timeout` on DDL in production.
- Never test a migration only on an empty database.

## Output format

```markdown
# Migration plan: <change>

## Context
engine, table size, write rate, deployment model

## Steps
| # | Deploy | SQL / action | Lock | Duration est. | Reversible |
|---|--------|--------------|------|---------------|------------|

## Backfill
batch size, throttle, progress query, expected duration

## Rollback
per step, with data-loss statement

## Verification
- row counts before/after
- constraint validated
- application reads new column correctly
- replication lag stayed under X

## Risks
- <risk and mitigation>
```

## Error handling

| Condition | Action |
|-----------|--------|
| Engine version unknown | Ask; locking behaviour differs enough that guessing is unsafe |
| Table size unknown | Require a row count before estimating; do not proceed on a guess |
| Migration would lock a hot table | Propose the online alternative (concurrent index, NOT VALID constraint) |
| Existing data violates the new constraint | Report the offending rows; do not delete them to make the migration pass |

## Example

**Input:** rename `users.name` to `users.full_name` on a 12M-row Postgres table, zero downtime.
**Output:** a five-deploy expand-and-contract plan, batched backfill at 5,000 rows with a
200ms sleep, `lock_timeout = 3s`, a rollback per step, and a verification query set.
