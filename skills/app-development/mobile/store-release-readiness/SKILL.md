---
name: store-release-readiness
description: Runs a pre-submission audit for an iOS or Android release, checking store metadata, privacy disclosures, permission usage strings, signing, versioning, screenshots, and rejection-prone patterns, and returns a pass/fail checklist with fixes. Use when preparing a build for App Store or Play Store submission, or when a submission was rejected.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Store Release Readiness

A checklist that reflects what reviewers actually reject for, not what the marketing page
says. Run it on the release candidate, not on a debug build.

## When to use

- Before submitting a build.
- After a rejection, to find the other issues before resubmitting.
- When taking over an app you did not build.

## Workflow

### 1. Identify the target and its current rules

Ask for platform (iOS/Android), distribution track (production, beta, internal), and whether
the app handles accounts, payments, health, children's data, or location. Those four
answers change which rules apply. Check the current store policy pages rather than relying
on memory — both stores change requirements several times a year.

### 2. Version and build identity

- Marketing version bumped where required; build number strictly greater than the last
  uploaded build.
- Bundle ID / application ID matches the store record.
- No debug suffixes (`-debug`, `-staging`) in the production build.
- Minimum OS target is stated and still supported by the store.

### 3. Signing and entitlements

| Platform | Check |
|----------|-------|
| iOS | Distribution certificate valid, provisioning profile matches bundle ID and entitlements, no expired profile |
| Android | Upload key or Play App Signing configured, keystore backed up outside the repo, `versionCode` incremented |

Never print or commit keystore passwords, `.p12` contents, or provisioning profiles.

### 4. Privacy and permissions

- Every permission declared has a real, current use.
- iOS usage-description strings name the specific feature, not "for a better experience".
- Android `QUERY_ALL_PACKAGES`, background location, SMS, and accessibility permissions each
  have the store's justification form completed.
- Privacy manifest (iOS) covers required-reason APIs and third-party SDKs.
- Data-safety form (Android) matches what the app actually collects and sends.
- Account deletion path exists in-app if accounts can be created.

### 5. Metadata

- Title, subtitle, and description contain no unverifiable claims, competitor names, or
  pricing.
- Screenshots show the real app, current UI, and no device frames that misrepresent size.
- Age rating questionnaire answered consistently with content.
- Support URL and privacy policy URL resolve and match the app.
- What's-new text describes this build.

### 6. Rejection-prone behaviour

- No placeholder content, "lorem ipsum", or empty states that look broken.
- No external payment links for digital goods where the store requires in-app purchase.
- No forced login before any value is visible, unless the store permits it for the category.
- Demo account supplied if login is required for review.
- No crash on first launch with a clean install and no network.
- ATT prompt (iOS) appears with a valid purpose string, or the app does not track.

### 7. Build health

- Release build runs with the release configuration, not debug.
- No logging of tokens, personal data, or full request bodies.
- Crash-free on the oldest supported OS in a real or high-fidelity emulator.
- App size within the store's cellular-download limits, or the user is warned.

## Rules

- Report facts with evidence: file, value, screenshot, or store policy URL.
- Never state that a submission will be approved. Reviewers are the only authority.
- Do not add a permission to "future-proof" the app; unused permissions are a rejection risk.
- Do not put credentials in the checklist output.

## Output format

```markdown
# Release readiness – <app> <version> (<build>)

## Verdict
BLOCKED | READY WITH RISKS | READY

## Blockers
| # | Area | Finding | Evidence | Fix |
|---|------|---------|----------|-----|

## Risks
| # | Area | Finding | Why it matters |

## Passed
- <grouped list>

## Not verified
- <item> – reason (no device, no store access, etc.)
```

## Error handling

| Condition | Action |
|-----------|--------|
| No access to store console | Audit the build and metadata locally; list console-only checks as unverified |
| Policy page changed and is ambiguous | Quote the policy text and flag it for human review; do not guess |
| Signing material is missing | Stop and report; do not generate replacement keys without explicit permission |

## Example

**Input:** iOS 2.4.0 build 318, production.
**Output:** BLOCKED — missing `NSCameraUsageDescription` for the receipt scanner, stale
provisioning profile expiring in 6 days, and a screenshot showing a placeholder avatar.
Plus 4 risks and 11 passed checks.
