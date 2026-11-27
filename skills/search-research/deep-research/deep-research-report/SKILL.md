---
name: deep-research-report
description: Runs a multi-source research task to a cited report, with a written question, a source plan, parallel search passes, claim-level citations, and an explicit separation of what is established from what is inferred. Use when asked to research a topic thoroughly, produce a market or technical brief, or answer a question that needs more than one source.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Deep Research Report

Research fails quietly. A confident paragraph with one weak source is worse than an admitted gap.

## When to use

- A question needs several sources and a synthesis.
- Producing a brief, landscape review, or due-diligence memo.
- Verifying a claim that has been repeated but never checked.
- Comparing options where the answer is not in one document.

Not for: a single fact lookup, or a question the user can answer from their own data.

## Workflow

### 1. Turn the request into answerable sub-questions

Write the main question, then 4–8 sub-questions that would jointly answer it. State what would
change the answer — the disconfirming evidence you are looking for. Without that, the research
becomes a search for confirmation.

```
Question: Should a 12-person team migrate from X to Y in 2026?
Sub-questions:
1. What capabilities does Y have that X lacks, and are they needed at this team size?
2. What is the measured migration cost in comparable teams?
3. What are the failure modes reported after migration?
4. What is X's roadmap for the next 12 months?
5. Disconfirming: which teams migrated and moved back, and why?
```

### 2. Plan sources by type

Aim for at least three independent types:

| Type | Use | Weakness |
|------|-----|----------|
| Primary documents (specs, filings, official docs) | Authoritative facts | May be outdated or promotional |
| Independent reporting | Context, criticism | Second-hand |
| Practitioner accounts (issues, forums, postmortems) | Real failure modes | Anecdotal, self-selected |
| Data (benchmarks, surveys) | Quantities | Methodology often unstated |

Record the plan before searching, so coverage can be checked at the end.

### 3. Search in passes, not one query

- Pass 1: broad, to map the vocabulary.
- Pass 2: targeted per sub-question, using the vocabulary from pass 1.
- Pass 3: disconfirming — search for failures, criticisms, and "X vs Y problems".
- Pass 4: recency — check whether anything changed in the last 6–12 months.

Save every candidate source with URL, date, and type before reading in depth.

### 4. Extract claims, not summaries

For each source, record specific claims with:

- the claim, in one sentence;
- the exact quote or figure;
- the date of the underlying fact (not the page's publish date);
- the source's interest in the claim (vendor, competitor, neutral);
- confidence: high / medium / low.

A summary you cannot cite is not usable.

### 5. Reconcile conflicts explicitly

When sources disagree, do not average them. State:

```
Source A (2025-11) says 40% adoption.
Source B (2026-02) says 12% adoption.
Difference: A counts trials, B counts paid seats. Both are internally consistent;
they measure different things.
```

### 6. Write the report

Structure:

1. **Answer** — the direct answer in 3–5 sentences, up front.
2. **Confidence and what would change it.**
3. **Findings** — one section per sub-question, each claim cited inline.
4. **Conflicts and gaps** — what the sources disagree on, and what could not be established.
5. **Implications** — what follows for the decision, clearly separated from fact.
6. **Sources** — full list with dates and access dates.

### 7. Audit your own report

- Every factual sentence has a citation or is labelled as inference.
- No source is cited for a claim it does not make.
- No number appears without its date and definition.
- The "gaps" section is non-empty; a perfect report is suspicious.
- The answer would survive if the weakest source were removed.

## Rules

- Never invent a source, quote, statistic, or URL.
- Never cite a source you did not open and read.
- Never present a vendor's claim as a neutral finding without labelling it.
- Never state a percentage without its denominator and date.
- Do not hide a conflicting source; report it.
- Do not use a source whose date you cannot determine for a time-sensitive claim.

## Output format

```markdown
# <Title>

## Answer
<3–5 sentences>

## Confidence
<high/medium/low> — because <reason>. Would change if <evidence>.

## Findings
### 1. <sub-question>
<claim> ([S1], 2025-11). <claim> ([S3], 2026-01).

## Conflicts and gaps
- <conflict, with both sources>

## Implications
<clearly marked as inference>

## Sources
[S1] Author. "Title". Publisher, date. URL. Accessed 2026-11-22.
```

## Error handling

| Condition | Action |
|-----------|--------|
| Paywalled source is essential | Report the paywall and what it would likely establish; do not guess its contents |
| Only vendor sources exist | Say so; downgrade confidence and label the section as vendor-sourced |
| Sources are all older than 12 months on a fast-moving topic | State the staleness explicitly |
| A sub-question cannot be answered | Report it as a gap rather than filling it with inference |
| Search returns only SEO content farms | Move to primary sources and practitioner forums; note the shift |

## Example

**Input:** "Should we migrate our CI from X to Y?"
**Output:** a 1,400-word report with a direct answer, 11 cited sources across four types, a
conflict about migration cost resolved by definition, four gaps including missing data on teams
under 20 people, and an explicit confidence rating of medium.
