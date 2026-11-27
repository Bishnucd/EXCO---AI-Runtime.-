---
name: dashboard-spec
description: Turns a decision question into a dashboard specification: the metric definitions, grain, filters, chart types, layout, and empty and error states, written before any chart is built. Use when asked to build a dashboard, when a dashboard has charts nobody uses, or when two teams disagree about what a metric means.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Dashboard Specification

A dashboard answers a recurring question. If the question is not written down, the dashboard
becomes a wall of charts that no one can act on.

## When to use

- Before building or rebuilding a dashboard.
- A dashboard has high traffic and no decisions attributed to it.
- Two teams define the same metric differently.
- Adding a panel to an existing dashboard.

## Workflow

### 1. Write the decision, not the topic

Bad: "Sales dashboard."
Good: "Every Monday the sales lead decides which two regions to push this week, and needs to
see where pipeline coverage is below 3× and why."

Record: who looks at it, how often, and what they do differently based on what they see. If
the answer is "nothing", stop — a report is more appropriate than a dashboard.

### 2. Define each metric in one sentence plus a formula

| Field | Example |
|-------|---------|
| Name | Pipeline coverage |
| Definition | Open pipeline value ÷ quota for the same period |
| Formula | `SUM(opportunity.amount WHERE stage NOT IN (closed_won, closed_lost)) / SUM(quota.amount)` |
| Grain | Region × week |
| Exclusions | Internal deals, test accounts, deals created before fiscal year start |
| Source | `fct_opportunities`, `dim_region`, `fct_quota` |
| Owner | RevOps |
| Known trap | Deals with no close date inflate the numerator |

Every metric needs a formula and an exclusion list. "Revenue" without a definition is a bug
waiting to be argued about.

### 3. Choose the chart by the question type

| Question | Chart |
|----------|-------|
| How has it changed over time? | Line, with a comparison period |
| How does it compare across categories? | Sorted horizontal bar |
| What is the composition? | Stacked bar; avoid pie beyond 3 slices |
| Is it above or below target? | Bullet or bar with a target line |
| Where is the outlier? | Scatter, or a table sorted by deviation |
| Exactly what are the numbers? | Table, always available |

One question per panel. If a panel needs two sentences to explain, split it.

### 4. Design the layout

- Top row: the 1–3 numbers that drive the decision, with trend and target.
- Second row: the breakdown that explains a bad top-line number.
- Below: detail tables for investigation.
- Global filters at the top left: date range, segment. Default to the most common choice.
- Every panel states its grain and last-refresh time.

### 5. Specify the states nobody designs

| State | Requirement |
|-------|-------------|
| Loading | Skeleton, not a spinner over stale numbers |
| Empty | Explains why it is empty and what to do (widen the date range) |
| Partial data | Marks the affected panels and shows the freshness timestamp |
| Error | Names the failed source; does not render zero |
| No permission | Hides the panel rather than showing an error |
| Extreme values | Axis behaviour stated: clipped with a marker, or log scale |

Rendering zero when a query failed is the most dangerous state in analytics. Forbid it.

### 6. Write the acceptance criteria

- Each metric's number matches an independent query, to the stated rounding.
- Filters change every panel consistently.
- Timezone and week-start are stated and applied uniformly.
- Load time under the stated budget at the p95 data volume.

## Rules

- No metric without a formula, an owner, and an exclusion list.
- No dual-axis charts; they imply correlations that do not exist.
- No truncated y-axis on bar charts; it exaggerates differences.
- No red/green alone to encode good/bad; add a sign or label for colour-blind readers.
- No chart that cannot be exported as the underlying numbers.

## Output format

```markdown
# Dashboard spec: <name>

## Decision
<who, how often, what they do differently>

## Metrics
| Metric | Definition | Formula | Grain | Exclusions | Source | Owner |

## Layout
<row-by-row description, with the chart type per panel>

## Filters
<global and panel-level>

## States
<loading, empty, partial, error, no-permission>

## Acceptance criteria
- <testable statement>

## Out of scope
- <what this dashboard deliberately does not answer>
```

## Error handling

| Condition | Action |
|-----------|--------|
| No decision owner identified | Ask once; if none, propose a report instead and say why |
| Metric definitions conflict between teams | Present both formulas and the difference in numbers; escalate rather than pick |
| Data source cannot support the grain | State the closest feasible grain and the resulting limitation |
| User asks for more than 7 panels | Propose splitting into an overview plus a detail view |

## Example

**Input:** "Build a churn dashboard for the CS team."
**Output:** a decision statement (weekly save-list prioritisation), 5 metrics with formulas,
a 2-row layout, global date/segment filters, explicit empty and error states, and a note that
the current churn definition double-counts downgrades.
