---
name: secret-leakage-git-history-scrubber
description: Permanently purges committed credentials, API keys, and large blobs from git repository history using git-filter-repo. Use when remediating committed secrets across all historical commits.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/newren/git-filter-repo"
---
# Secret Leakage Git History Scrubber

## Overview
Simply committing a deletion leaves secrets visible in git history. git-filter-repo rewrites historical commits, removing sensitive files and replacing compromised keys with dummy strings.

## Operational Workflow

1. **Create fresh bare mirror clone of the contaminated repository.**:
   - Create fresh bare mirror clone of the contaminated repository.

2. **Execute git-filter-repo --replace-text expressions.txt to sanitize secrets across all commits.**:
   - Execute git-filter-repo --replace-text expressions.txt to sanitize secrets across all commits.

3. **Purge reflog and force garbage collection using git gc --prune=now --aggressive.**:
   - Purge reflog and force garbage collection using git gc --prune=now --aggressive.

4. **Force push sanitized history to remote and instruct all collaborators to re-clone fresh copies.**:
   - Force push sanitized history to remote and instruct all collaborators to re-clone fresh copies.

## Recommended Tools & Environments
- git-filter-repo
- Git Internals
- Secret Remediation
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
