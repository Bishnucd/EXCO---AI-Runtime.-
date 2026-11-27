---
name: csv-profiling
description: Profiles a CSV or Parquet dataset before analysis, reporting schema, null rates, cardinality, distributions, duplicate keys, encoding problems, and likely join keys. Use when opening an unfamiliar dataset, when numbers look wrong, or when deciding what cleaning is actually required.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# CSV Profiling

Look at the data before trusting it. Every claim in a later analysis depends on assumptions
this step makes explicit.

## When to use

- First contact with an unfamiliar dataset.
- Totals or counts disagree with another source.
- Deciding which columns can be a key, a category, or a measure.
- Before writing any cleaning code.

## Workflow

### 1. Read the file defensively

- Detect encoding: try UTF-8, then check for a BOM, then Windows-1252. Report which was used.
- Detect the delimiter by counting candidates in the first lines (`,` `;` `\t` `|`).
- Read a 1,000-row sample plus the header before loading everything.
- Note the row count from a full scan; do not assume the sample is representative.

### 2. Profile each column

For every column report:

| Field | Meaning |
|-------|---------|
| `dtype_inferred` | integer, decimal, date, boolean, string, mixed |
| `null_rate` | share of empty or placeholder values (`""`, `NA`, `NULL`, `-`, `n/a`) |
| `distinct` | exact count, and `distinct/null_rows` ratio |
| `min` / `max` / `mean` / `p50` / `p95` | numeric columns only |
| `top_values` | 10 most frequent, with counts |
| `examples` | 3 non-null samples |
| `format_issues` | mixed date formats, thousands separators, currency symbols, trailing spaces |

Placeholders are not nulls. Report them separately: a column that is 40% `"N/A"` strings is
not 40% null, and the difference changes how you clean it.

### 3. Check the shape of the table

- **Duplicates:** exact duplicate rows, and duplicates on the candidate key.
- **Candidate keys:** columns (or combinations) where `distinct == row_count - nulls`. Verify
  uniqueness on the full file, not the sample.
- **Referential sanity:** for ID columns, are there orphan or impossible values?
- **Monotonicity:** is a "date" or "sequence" column actually sorted? Gaps?
- **Constant columns:** zero variance — usually a broken export, not a feature.

### 4. Check numeric plausibility

- Negative values in a count or quantity column.
- Percentages outside 0–100.
- Amounts with more decimal places than the currency allows.
- Extreme outliers: report the top and bottom 5 values with row numbers. Do not remove them
  in profiling; removal is a later, explicit decision.

### 5. Check dates and time zones

- Confirm the format by parsing, not by eyeballing.
- Identify whether timestamps carry an offset. If not, state the assumed zone.
- Check for the "midnight default" pattern: many rows at exactly 00:00:00 usually means a date
  was coerced into a timestamp.

### 6. Report

Produce `PROFILE.md` plus a machine-readable `profile.json`. Lead with the five findings that
would most likely invalidate an analysis.

## Rules

- Never modify the source file. Profiling is read-only.
- Never infer a key from column names alone; verify uniqueness on the full data.
- Report mixed types explicitly; do not silently coerce a column to string.
- Do not drop outliers during profiling.
- State the exact row count profiled and whether it was a sample.

## Output format

```markdown
# Profile: <file>
Rows: 1,284,002 | Columns: 27 | Encoding: UTF-8 (BOM) | Delimiter: ,

## Headline findings
1. `customer_id` has 412 duplicate values — not a unique key.
2. `amount` is 3.1% empty strings, not nulls.
3. `created_at` is 38% exactly midnight — likely date-only source.
4. `country` has 14 spellings of 4 countries.
5. `qty` has 6 negative values, all on cancelled orders.

## Columns
| column | type | null% | distinct | notes |
...

## Cleaning required before analysis
- <specific step, with the column and the rule>
```

## Error handling

| Condition | Action |
|-----------|--------|
| File too large to load in memory | Profile in chunks; compute exact distinct counts with a set or a probabilistic sketch, and say which |
| Ragged rows (wrong field count) | Report the line numbers and the expected vs actual count; do not guess at a fix |
| Binary content in a text file | Detect and report; refuse to parse |
| No header row | Report the inferred header and ask for confirmation before continuing |

## Example

**Input:** `orders.csv`, 1.28M rows.
**Output:** profile with 5 headline findings, a column table, and a cleaning list of 7 items —
duplicate `customer_id`, three date formats, a currency-symbol amount column, and 412 rows
with a negative quantity on non-cancelled orders.
