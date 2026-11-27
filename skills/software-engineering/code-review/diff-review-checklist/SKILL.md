---
name: diff-review-checklist
description: Reviews a git diff for correctness, regression risk, security, and test coverage, producing prioritised findings with file and line references rather than style opinions. Use when reviewing a pull request, auditing an agent-generated change, or checking a diff before merging.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Diff Review Checklist

Reviews what changed and what it can break. Style is handled by formatters; this review is
about behaviour.

## When to use

- Reviewing a pull request.
- Auditing a large AI-generated change before accepting it.
- A pre-merge check on a risky area (auth, payments, migrations, concurrency).

## Workflow

### 1. Establish intent

Read the PR description and the commit messages. Write one sentence describing what the
change claims to do. If you cannot, that is finding zero: the change is not reviewable until
the intent is stated.

### 2. Map the blast radius

List every file touched and classify:

- **Behaviour** — logic, handlers, queries, config that changes runtime behaviour.
- **Contract** — public API, event schema, CLI flags, file formats.
- **Test** — test code.
- **Inert** — comments, formatting, docs, lockfile churn.

Only Behaviour and Contract files need deep reading. Say so explicitly, so the author knows
what was and was not reviewed.

### 3. Read for correctness

For each behaviour change, answer:

1. What are the inputs, including empty, null, zero, and very large?
2. What is the error path, and does it leave state consistent?
3. Is the operation idempotent if retried?
4. Does it hold under concurrency (two requests, two workers, two tabs)?
5. Does it respect existing invariants (ordering, uniqueness, tenancy boundaries)?
6. Are off-by-one and boundary conditions right (`<` vs `<=`, first/last element)?

### 4. Check security specifically

- Authorisation on every new entry point, not just authentication.
- User input reaching a query, a shell, a template, or a file path.
- Secrets in logs, error messages, fixtures, or committed config.
- Deserialisation of untrusted data.
- New dependency: name, version, maintenance, licence.

### 5. Check tests

- Does a test fail if the change is reverted? If not, the test does not cover the change.
- Are the assertions about behaviour rather than implementation details?
- Is there a test for the error path, not only the happy path?
- Any test that was deleted or weakened? Ask why.

### 6. Check operability

- New config has a default or a startup error that names the missing variable.
- New failure modes are observable (log, metric, or explicit error).
- Rollback is possible without a data migration.
- Feature flags, if used, default to the safe state.

### 7. Report

Order findings by severity. Every finding cites `file:line`, states the concrete failure, and
gives a fix. No "consider refactoring" without a reason tied to a failure.

## Severity

| Level | Meaning | Merge decision |
|-------|---------|----------------|
| Blocker | Data loss, security hole, broken invariant, or certain regression | Do not merge |
| Major | Likely bug under realistic conditions, or missing authorisation | Fix before merge |
| Minor | Edge case, poor error message, missing test for a real path | Fix or file an issue |
| Nit | Preference with no behavioural consequence | Optional; label as nit |

## Rules

- Review the diff, not the whole repository. Do not report pre-existing problems as if this
  change caused them; note them separately as "pre-existing".
- Do not approve a change you did not understand. Ask a question instead.
- Do not demand a rewrite when a targeted fix works.
- Never approve based on the description alone.
- Do not run untrusted code from the branch to "see if it works" without sandboxing.

## Output format

```markdown
## Intent
<one sentence>

## Reviewed
- Behaviour: <files>
- Contract: <files>
- Not reviewed: <files and why>

## Findings
### Blocker – <title> (`path/file.ts:42`)
**Failure:** <what goes wrong, under which input>
**Fix:** <specific change>

### Minor – <title> (`path/file.ts:88`)
...

## Tests
<does the suite cover the change; what is missing>

## Verdict
APPROVE | APPROVE WITH NITS | REQUEST CHANGES
```

## Error handling

| Condition | Action |
|-----------|--------|
| Diff is too large to review (>~800 changed lines) | Ask for a split, or review by file group and state coverage |
| Cannot build or run tests | Say so; review statically and mark runtime behaviour unverified |
| Generated code dominates the diff | Review the generator config and a sample of output, not every line |

## Example

**Input:** 240-line diff adding a "transfer credits" endpoint.
**Output:** 1 blocker (missing tenant check on the destination account), 2 majors (non-atomic
balance update; retry double-spends without an idempotency key), 3 minors, and a note that
the new test only covers the success path.
