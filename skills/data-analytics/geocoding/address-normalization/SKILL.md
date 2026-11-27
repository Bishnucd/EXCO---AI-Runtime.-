---
name: address-normalization
description: Normalises messy postal addresses into a canonical form, geocodes them with a confidence score, and routes low-confidence matches to manual review instead of silently guessing. Use when cleaning a customer or delivery address list, matching addresses across systems, or preparing data for routing.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Address Normalization

An address pipeline that reports its own uncertainty. A wrong geocode is worse than a missing
one, because it looks correct downstream.

## When to use

- Cleaning an address list before geocoding or delivery.
- Matching the same address across two systems.
- Preparing delivery stops for routing.
- Auditing a list where deliveries failed.

## Workflow

### 1. Understand the input distribution

Profile the column first: how many are free-text, how many already have components, which
countries, and what the common malformations are. Sample 30 rows by hand and note the patterns
before writing rules.

### 2. Normalise in layers

Apply in order, recording which layer changed each row:

| Layer | Action |
|-------|--------|
| Encoding | Fix mojibake, normalise Unicode (NFKC), strip control characters |
| Whitespace | Collapse runs, trim, remove trailing punctuation |
| Case | Title-case for display; keep a case-folded copy for matching |
| Abbreviations | `St` → `Street`, `Rd` → `Road`, `Apt`/`#`/`Unit` → a single unit field |
| Directionals | `N` → `North`, applied per country convention |
| Country names | Map to ISO 3166-1 alpha-2; record the mapping used |
| Subdivision | Map to ISO 3166-2 where the country has them |
| Postal code | Apply the country's pattern; reject impossible lengths |
| Phone-like noise | Remove stray phone numbers, emails, and delivery notes from the address field |

Never apply US-centric rules to a non-US address. Detect the country first; if unknown, keep
the original and mark it for review.

### 3. Parse into components

Target: `line1, line2, locality, admin_area, postal_code, country`. Use a parser appropriate to
the country rather than one global regex. Where parsing is ambiguous, keep the original string
alongside the parsed parts — never discard the source.

### 4. Geocode with explicit confidence

Record per address:

| Field | Example |
|-------|---------|
| `match_type` | exact / interpolated / street-centroid / locality-centroid / no-match |
| `confidence` | 0–1, from the provider plus your own checks |
| `provider` | which service returned it |
| `lat`, `lon` | coordinates |
| `precision` | rooftop / parcel / street / city |

**Reject anything at locality-centroid precision for delivery.** A city-level geocode is fine
for mapping a customer base and useless for routing.

### 5. Add independent validation

Do not rely on one provider. Cross-check:

- Postal code is consistent with the city and state.
- Coordinates fall inside the country polygon.
- Two providers agree within ~100 m for rooftop claims.
- The building number exists on the matched street where the provider supports it.

Disagreement is a review flag, not a reason to average the coordinates.

### 6. Route to review

Buckets:

- `auto_accept` — exact match, high confidence, all checks pass.
- `review` — interpolated, provider disagreement, or a corrected component.
- `reject` — no match, or impossible combination.

Report counts per bucket and per country. A 30% review rate is a finding about the input, not a
failure of the pipeline.

## Rules

- Never invent a missing component (postal code, city) to make a match succeed.
- Never overwrite the original address; keep it in `source_address`.
- Never discard a failed geocode; it belongs in the review bucket.
- Respect provider terms of service and caching restrictions.
- Do not store coordinates for addresses you are not permitted to process.

## Output format

```
normalized.csv
  source_address, line1, line2, locality, admin_area, postal_code, country,
  lat, lon, match_type, confidence, precision, bucket, provider, changed_layers
REVIEW.md   # counts by bucket and country, top failure patterns, examples
```

## Error handling

| Condition | Action |
|-----------|--------|
| Country cannot be determined | Keep the original, bucket `review`, do not assume |
| Provider returns multiple candidates | Choose only if one is clearly closer; otherwise `review` with candidates listed |
| Rate limited | Back off, cache results, and resume; never switch to an unauthorised provider |
| Address is a PO box or military address | Tag it; do not attempt street-level geocoding |

## Example

**Input:** 8,400 customer addresses, mostly UK and Ireland.
**Output:** 71% auto-accept, 24% review, 5% reject; the review list dominated by addresses with
a missing postcode and by 60 rows where two providers disagreed by more than 2 km.
