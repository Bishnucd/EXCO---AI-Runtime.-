---
name: github-apps-oauth-installation-flow
description: Authors GitHub Apps with organization installation tokens, webhook listeners, and fine-grained permissions. Use when building deep developer tooling integrations with GitHub repositories.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.github.com/en/apps/creating-github-apps"
---
# Github Apps Oauth Installation Flow

## Overview
Legacy OAuth apps require broad all-or-nothing repository permissions. GitHub Apps support fine-grained repository access, organization installations, and short-lived 1-hour installation tokens.

## Operational Workflow

1. **Create GitHub App manifest declaring required permissions (e.g., issues**:
   - Create GitHub App manifest declaring required permissions (e.g., issues: write, pull_requests: read).

2. **Implement webhook receiver endpoint verifying X-Hub-Signature-256 HMAC cryptographic signatures.**:
   - Implement webhook receiver endpoint verifying X-Hub-Signature-256 HMAC cryptographic signatures.

3. **Generate installation access tokens using App private key (RS256 JWT) via Octokit app authentication.**:
   - Generate installation access tokens using App private key (RS256 JWT) via Octokit app authentication.

4. **Execute authorized GitHub API requests on behalf of the specific customer organization.**:
   - Execute authorized GitHub API requests on behalf of the specific customer organization.

## Recommended Tools & Environments
- GitHub Apps
- Octokit
- Webhooks
- OAuth2 / App Tokens

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
