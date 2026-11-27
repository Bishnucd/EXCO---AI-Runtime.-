---
name: github-actions-oidc-aws-federation
description: Configures OpenID Connect (OIDC) authentication between GitHub Actions and AWS IAM without storing long-lived AWS secret access keys. Use when securing cloud deployment pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services"
---
# Github Actions Oidc Aws Federation

## Overview
Storing static AWS credentials in repository secrets risks credential leakage. GitHub Actions OIDC exchanges short-lived JWT tokens for temporary AWS STS credentials based on repo and branch claims.

## Operational Workflow

1. **Create IAM OIDC Identity Provider in AWS account for token.actions.githubusercontent.com.**:
   - Create IAM OIDC Identity Provider in AWS account for token.actions.githubusercontent.com.

2. **Configure IAM Role trust policy restricting sts**:
   - Configure IAM Role trust policy restricting sts:AssumeRoleWithWebIdentity to repo:owner/repo:ref.

3. **Grant permissions**:
   - Grant permissions: id-token: write in GitHub Actions workflow job.

4. **Invoke aws-actions/configure-aws-credentials passing role-to-assume without static secrets.**:
   - Invoke aws-actions/configure-aws-credentials passing role-to-assume without static secrets.

## Recommended Tools & Environments
- GitHub Actions
- AWS IAM OIDC
- CloudFormation / Terraform
- YAML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
