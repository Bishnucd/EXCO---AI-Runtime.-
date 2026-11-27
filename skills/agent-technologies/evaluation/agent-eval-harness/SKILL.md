---
name: agent-eval-harness
description: Builds a small, honest evaluation harness for an agent or prompt: a labelled task set, deterministic graders where possible, a calibrated model judge where not, and a regression report with cost and latency. Use when changing a prompt or model and needing to know whether it got better, or when an agent works in demos but fails in production.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Agent Eval Harness

Small, specific, and re-runnable beats large and unmaintained. The goal is a number you can
trust enough to block a merge.

## When to use

- Changing a prompt, model, tool schema, or retrieval strategy.
- Deciding between two models.
- An agent performs well in demos and badly on real inputs.
- Adding a regression gate to CI.

## Workflow

### 1. Define the decision the eval supports

Write one sentence: "This eval decides whether change X ships." If no decision depends on the
result, do not build the eval.

### 2. Collect tasks from reality

Sources, in order of value:

1. Real failed production inputs (highest value).
2. Real successful inputs, sampled across the distribution.
3. Inputs written by someone other than the prompt author.
4. Synthetic edge cases (lowest value; use to cover known gaps).

Target 30–100 tasks for a first harness. Cover: typical, edge, adversarial, and "should
refuse" cases. Record provenance for each task.

### 3. Define success per task

Every task needs an expected outcome that a third party could check:

| Task type | Grading method |
|-----------|----------------|
| Structured output (JSON, SQL, code) | Exact match, schema validation, or executable test |
| Extraction | Field-level precision/recall against gold labels |
| Classification | Label match; report per-class confusion |
| Free text | Rubric with 3–5 binary criteria, scored by a judge |
| Agent trajectory | Required tool calls present, forbidden calls absent, final state correct |

Prefer executable checks. A grader that runs the produced code or validates the produced
schema is worth ten rubric judgements.

### 4. Build the judge carefully (only where needed)

If a model judge is unavoidable:

- Give it the rubric as binary questions, not a 1–10 scale.
- Include 2–3 worked examples of pass and fail.
- Hide which system produced the output; randomise order.
- Calibrate against 20 human-labelled outputs; report agreement. Below ~80% agreement,
  the judge is not usable as a gate.
- Record the judge model and version — it is part of the measurement instrument.

### 5. Run and report

For each run, record:

- pass rate overall and per task category;
- cost per task and total;
- p50/p95 latency;
- for every failure, the task ID, input, expected, actual, and grader reasoning.

Never report a single aggregate number without the per-category breakdown; averages hide
regressions in a small but important category.

### 6. Make it a gate

- Store the baseline results as a file in the repo.
- Fail CI when pass rate drops by more than the noise floor (measure it by running the same
  system twice).
- Allow explicit, reviewed baseline updates — never auto-accept a new baseline.

### 7. Guard against overfitting

- Keep a held-out set the prompt author has not seen.
- Rotate in new real failures each cycle.
- If pass rate is near 100%, the set is too easy: add harder real cases.

## Rules

- Every task has a provenance note and an owner.
- No task may be scored by string similarity alone unless the output is genuinely free-form.
- Do not tune on the held-out set; if you look at it, it is no longer held out.
- Report cost and latency with quality. A 2% quality gain for 10× cost is a decision, not a win.
- Do not claim improvement without a baseline measured on the same task set.

## Output format

```
evals/
├── tasks.jsonl           # id, input, expected, category, provenance
├── graders/              # executable graders where possible
├── run.mjs               # runner: system under test, model, concurrency, retries
├── baselines/<date>.json
└── REPORT.md             # pass rate, per-category, cost, latency, failure appendix
```

## Error handling

| Condition | Action |
|-----------|--------|
| Fewer than 20 real tasks available | Report that the eval is directional only; do not gate on it |
| Judge agreement below 80% | Replace with executable checks or human labelling |
| Non-deterministic outputs | Run each task 3× and report pass@1 and pass@3 |
| Provider rate limits | Cache responses keyed by task+system version; report cache hit rate |

## Example

**Input:** support-triage agent, prompt rewrite proposed.
**Output:** 64 tasks from 5 weeks of tickets, 41 executable label checks, 23 rubric checks
with 86% human agreement, baseline pass 0.71 → 0.79, cost +12%, p95 latency +300ms, and
three tasks that regressed (listed with inputs).
