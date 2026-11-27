---
name: threat-model-stride
description: Builds a threat model for a system or feature using STRIDE, mapping data flows, trust boundaries, and assets, then ranking threats by realistic impact and producing testable mitigations. Use when designing a new feature, reviewing an architecture, or preparing for a security review.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Threat Model with STRIDE

A threat model is a list of things that could go wrong, each tied to a specific element and a
specific mitigation you can test.

## When to use

- Designing a feature that handles auth, money, personal data, or file uploads.
- Reviewing an architecture before build.
- Preparing for a security review or a customer questionnaire.
- After an incident, to find the sibling issues.

## Workflow

### 1. Define the scope and the assets

Write down what is in scope and what is not. Then list the assets worth protecting, ranked:

| Asset | Why it matters | Where it lives |
|-------|----------------|----------------|
| Session tokens | Account takeover | Browser, cookie, server memory |
| Payment records | Financial and legal | Primary DB, backups, logs |
| Uploaded files | Malware, data leak | Object storage, processing workers |

An asset that is not named will not be protected.

### 2. Draw the data flow

Minimal diagram, in text if necessary:

```
[browser] --HTTPS--> [CDN] --> [API gateway] --mTLS--> [service A] --> [DB]
                                              \--> [queue] --> [worker] --> [S3]
```

Mark every **trust boundary**: browser→server, service→service, service→third party,
service→database, admin→production. Threats cluster at boundaries.

### 3. Enumerate threats per element with STRIDE

For each element crossing a boundary, ask all six questions:

| Letter | Threat | Question |
|--------|--------|----------|
| S | Spoofing | Can someone pretend to be another user, service, or the CDN? |
| T | Tampering | Can data be modified in transit, at rest, or in the queue? |
| R | Repudiation | Can an actor deny an action because there is no trustworthy log? |
| I | Information disclosure | Can data leak through errors, logs, timing, or an over-broad response? |
| D | Denial of service | Can one actor exhaust connections, storage, queue depth, or a quota? |
| E | Elevation of privilege | Can a user reach another tenant's data or an admin action? |

Do not stop at the first plausible threat per element. The useful ones are usually the third.

### 4. Rank realistically

Score each threat on:

- **Likelihood:** requires an authenticated user? a leaked token? physical access? a rare race?
- **Impact:** data loss, account takeover, financial loss, reputational, regulatory.
- **Existing controls:** what already prevents or detects it.

Drop threats that require an attacker capability the system already excludes (for example, a
compromised host) unless that assumption is documented and accepted.

### 5. Write testable mitigations

Bad: "Validate input."
Good: "Reject uploads whose declared MIME type is not in {image/png, image/jpeg} AND whose magic
bytes disagree; verify by uploading a `.png` containing PHP and confirming a 415."

Each mitigation needs a verification method: a test, a config check, a query, or a review step.

### 6. Record accepted risks

Some threats will not be fixed. Record them with an owner, a reason, and a review date. An
accepted risk that is written down is a decision; an unrecorded one is an incident waiting.

### 7. Revisit on change

Re-run the model when: a new trust boundary appears, a new data type is stored, auth changes, or
a new third party is added.

## Rules

- Every threat names the element and the boundary it crosses.
- Every mitigation has a verification method.
- Do not list a threat with no plausible path from an attacker position.
- Do not mark a threat "mitigated" without evidence.
- Never include real credentials, tokens, or customer data in the model document.
- Do not rely on "the network is internal" as a control without stating it as an assumption.

## Output format

```markdown
# Threat model: <system / feature>

## Scope
in scope / out of scope / assumptions

## Assets
| Asset | Impact if compromised | Location |

## Data flow and trust boundaries
<diagram or list>

## Threats
| ID | Element | STRIDE | Threat | Likelihood | Impact | Control | Mitigation | Verify by |
|----|---------|--------|--------|------------|--------|---------|------------|-----------|

## Accepted risks
| ID | Risk | Owner | Reason | Review date |

## Open questions
- <question blocking a threat assessment>
```

## Error handling

| Condition | Action |
|-----------|--------|
| Architecture is unknown | Ask for the data flow; a threat model without boundaries is fiction |
| Threat depends on a control you cannot see | Mark it "assumed controlled — verify" rather than dropping it |
| Scope is the whole company | Narrow to one system; company-wide models become generic checklists |
| User wants only a compliance checklist | Say that a checklist is not a threat model, and offer both |

## Example

**Input:** file-upload feature for customer invoices.
**Output:** 14 threats across 3 boundaries, ranked; the top three are stored-XSS via SVG,
cross-tenant object access through a predictable key, and unbounded decompression; each with a
testable mitigation and a verification step.
