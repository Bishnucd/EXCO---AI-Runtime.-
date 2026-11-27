---
name: source-credibility-audit
description: Audits a set of sources or a draft document for credibility, checking provenance, date, methodology, conflicts of interest, and whether each citation actually supports the claim it is attached to. Use when fact-checking a draft, reviewing research before publication, or deciding whether a claim is safe to repeat.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Source Credibility Audit

The question is not "is this a real website". It is "does this source support this specific
claim, and how would I know if it were wrong".

## When to use

- Fact-checking a draft before publication.
- Reviewing a research report someone else produced.
- Deciding whether a statistic is safe to repeat.
- A claim is circulating and you need to find its origin.

## Workflow

### 1. List every checkable claim

Extract each factual assertion with its attached citation. Include uncited assertions — those are
findings too. Separate:

- **Verifiable facts** (dates, figures, named events).
- **Interpretations** (what a figure means).
- **Predictions** (what will happen).
- **Opinions** (what should happen).

Only the first category can be fact-checked. The rest can only be attributed.

### 2. Trace to the origin

For each claim, follow the citation chain to the primary source. Many statistics are quoted from a
secondary summary that itself cites a third source, and the number changes along the way.

Record: primary source, the chain length, and any transformation of the number.

### 3. Score the source on six axes

| Axis | Question | Red flag |
|------|----------|----------|
| Provenance | Who produced it, and can you find them? | No author, no organisation, no about page |
| Primary or secondary | Is this the original data or a retelling? | "According to a study" with no link |
| Date | When was the underlying fact established? | Page date is recent, data is from 2019 |
| Method | How was the number produced? | No methodology, no sample size, no denominator |
| Interest | Does the author benefit from the conclusion? | Vendor claiming its category is growing |
| Corroboration | Do independent sources agree? | A single source repeated across many sites |

A source can be credible and still not support the claim. Score the pair, not just the source.

### 4. Check the citation-claim fit

For each citation, answer:

1. Does the source actually state this?
2. Does it state it with the same scope (population, geography, time period)?
3. Is the claim stronger than the source? ("associated with" → "causes"; "up to 40%" → "40%")
4. Is the number correctly copied?

This step catches most errors, including in otherwise reputable documents.

### 5. Detect circular sourcing

Look for several "independent" sources that all trace back to one press release or one blog post.
A common pattern: a vendor survey becomes an industry statistic through repetition. Report the
convergence point.

### 6. Grade each claim

| Grade | Meaning |
|-------|---------|
| A | Primary source, current, method stated, corroborated |
| B | Credible secondary source, or primary with a minor gap |
| C | Single source, method unclear, or vendor-interested |
| D | Cannot trace to a source, or the source does not support the claim |
| X | Demonstrably wrong, or contradicts the cited source |

### 7. Report with fixes

For every C, D, or X, give the specific repair: find a primary source, soften the claim, add the
scope, or remove it.

## Rules

- Never upgrade a claim because it appears in many places; check whether they share an origin.
- Never accept a number without a denominator and a date.
- Never accept "studies show" as a citation.
- Never assume a reputable publisher guarantees a correct number; check the citation-claim fit.
- Do not label a source "unreliable" without stating which axis failed.
- Quote the exact supporting sentence; a paraphrase can hide a scope change.

## Output format

```markdown
# Credibility audit: <document>

## Summary
<n claims checked: nA / nB / nC / nD / nX>
<the three most consequential problems>

## Claim table
| # | Claim | Cited source | Origin traced | Grade | Issue | Fix |
|---|-------|--------------|---------------|-------|-------|-----|

## Circular sourcing
- <claim> — converges on <origin>

## Uncited assertions
- <claim> — needs a source or removal

## Recommended edits
1. <specific change>
```

## Error handling

| Condition | Action |
|-----------|--------|
| Source is paywalled | Grade no higher than B; state that the method could not be checked |
| Source has disappeared (link rot) | Try an archive; if unavailable, grade D and say so |
| Claim is a prediction | Do not fact-check; attribute it and check the forecaster's track record |
| Primary data is proprietary | Report the limitation; do not infer the method |
| Two credible sources conflict | Report both, with scope and date; do not pick silently |

## Example

**Input:** a 900-word market brief with 14 citations.
**Output:** 3 A, 4 B, 5 C, 2 D; the headline "40% of teams" traced to a vendor survey of 87
respondents, with 12 secondary sites all citing the same press release; and 6 uncited assertions
listed for removal or sourcing.
