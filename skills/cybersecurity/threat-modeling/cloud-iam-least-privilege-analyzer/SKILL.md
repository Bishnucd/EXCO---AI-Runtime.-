---
name: cloud-iam-least-privilege-analyzer
description: Audits AWS IAM policies and GCP IAM bindings for wildcard (*) permissions, privilege escalation paths, and unused credentials. Use when hardening cloud identity access management.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-overview.html"
---
# Cloud Iam Least Privilege Analyzer

## Overview
Over-permissive IAM roles are the leading vector in cloud breaches. Analyzing policies for dangerous wildcard actions (iam:PassRole, s3:*) and latent escalation paths prevents account takeover.

## Operational Workflow

1. **Execute AWS IAM Access Analyzer or PMapper graph traversal across cloud account roles.**:
   - Execute AWS IAM Access Analyzer or PMapper graph traversal across cloud account roles.

2. **Identify wildcard actions (***:
   - Identify wildcard actions (*:*) and roles granting dangerous privilege escalation vectors.

3. **Cross-reference CloudTrail activity logs to detect permissions unused over the past 90 days.**:
   - Cross-reference CloudTrail activity logs to detect permissions unused over the past 90 days.

4. **Generate downscoped least-privilege IAM policies matching actual observed API usage.**:
   - Generate downscoped least-privilege IAM policies matching actual observed API usage.

## Recommended Tools & Environments
- AWS IAM Access Analyzer
- PMapper
- Cloud Security
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
