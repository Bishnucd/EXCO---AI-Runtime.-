---
name: test-strategy-design
description: Designs a proportionate test strategy for a codebase or feature, choosing which behaviours get unit, integration, contract, or end-to-end coverage and defining the fixtures and failure cases for each. Use when a test suite is slow or flaky, when coverage numbers look good but bugs still ship, or when starting tests for an untested module.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Test Strategy Design

Decides what to test and at which level, then writes the tests that would actually catch the
bugs this codebase produces.

## When to use

- A suite is slow, flaky, or ignored.
- Coverage is high but regressions keep shipping.
- A new module needs tests and there is no convention to follow.
- Deciding whether a test should be a unit test or an end-to-end test.

## Workflow

### 1. Inventory the current suite

Record: number of tests per level, total runtime, flake rate, and the last five bugs that
reached production. The production bugs are the most valuable input — they tell you which
level is missing.

### 2. Classify behaviours by risk and cost of failure

For each behaviour, ask:

- How bad is it if this breaks silently? (money, data, security, user trust)
- How likely is it to break? (churn, complexity, third-party dependency)
- How expensive is it to test at each level?

High risk + high churn → test at the lowest level that can express the behaviour, plus one
end-to-end path.

### 3. Assign levels with explicit criteria

| Level | Use for | Do not use for |
|-------|---------|----------------|
| Unit | Pure logic, parsers, validators, state machines, money math | Anything requiring a database, network, or clock |
| Integration | Repository + database, handler + framework, queue consumer | Full user journeys |
| Contract | Client/server schema agreement, third-party API adapters | Internal function calls |
| End-to-end | One happy path per critical journey, plus one critical failure | Every permutation; form validation |

Aim for many unit tests, fewer integration tests, very few end-to-end tests — but derive the
count from risk, not from a pyramid diagram.

### 4. Define each test precisely

Write a table before writing code:

| Behaviour | Level | Fixture | Assertion | Fails if reverted? |
|-----------|-------|---------|-----------|--------------------|
| Expired token rejected | unit | frozen clock | 401 + error code | yes |

If you cannot state what makes the test fail, it is not a test.

### 5. Handle the hard parts explicitly

- **Time:** inject a clock; never sleep. Freeze time in tests.
- **Randomness:** inject a seed or a generator; assert on properties, not exact values.
- **Network:** fake at the HTTP boundary, not by monkey-patching internals.
- **Database:** real engine in a container, migrated to the current schema, transaction
  rolled back per test.
- **Concurrency:** deterministic orchestration (barriers/latches), not timing guesses.
- **Filesystem:** a temp directory per test, deleted after.

### 6. Make failures diagnostic

Each assertion message must include the input and the expected vs actual. A failing test
should tell you what broke without a debugger.

### 7. Remove what does not pay

Delete or downgrade tests that:
- assert on implementation details (private method calls, log strings, exact SQL);
- duplicate a cheaper test at a higher level;
- pass regardless of the change (no assertion, or an assertion on a mock's own setup);
- are flaky with no owner.

Record each removal with the reason.

## Rules

- One behaviour per test; one logical assertion group per test.
- No test depends on another test's side effects or on execution order.
- No `sleep` for synchronisation. If you need one, the code needs a hook.
- Do not chase a coverage percentage. Name the untested risk instead.
- Do not mock the thing under test.
- Every production bug gets a regression test at the lowest level that reproduces it.

## Output format

```
TEST_STRATEGY.md      # the behaviour table, level choices, fixtures, what is deliberately untested
tests/...             # the tests
```

`TEST_STRATEGY.md` must include a "Deliberately not tested" section with reasons — this is
as important as the covered list.

## Error handling

| Condition | Action |
|-----------|--------|
| No test runner configured | Choose the ecosystem default, state the choice, and add the minimal config |
| Suite already takes >10 minutes | Profile and report the slowest 10 tests before adding any |
| Code is untestable (hidden globals, static singletons) | Report the specific seam needed; propose the smallest refactor |
| Third-party service cannot be faked | Mark the behaviour as covered by a manual checklist instead of a fake test |

## Example

**Input:** payments module, 82% coverage, three refund bugs shipped last quarter.
**Output:** a behaviour table with 24 tests — 15 unit (rounding, proration, currency),
6 integration (transaction atomicity, unique constraint on idempotency key), 2 contract
(gateway adapter), 1 end-to-end refund path; plus the removal of 9 mock-heavy tests.
