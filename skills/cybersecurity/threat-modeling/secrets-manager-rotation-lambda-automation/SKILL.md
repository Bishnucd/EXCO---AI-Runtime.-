---
name: secrets-manager-rotation-lambda-automation
description: Configures automated, periodic database credential rotation using AWS Secrets Manager and rotation Lambda functions. Use when enforcing 30-day credential rotation policies.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_how.html"
---
# Secrets Manager Rotation Lambda Automation

## Overview
Static database passwords violate compliance standards and increase breach risk. AWS Secrets Manager rotates credentials through createSecret, setSecret, testSecret, and finishSecret stages automatically.

## Operational Workflow

1. **Store database administrative and application user credentials in Secrets Manager.**:
   - Store database administrative and application user credentials in Secrets Manager.

2. **Deploy rotation Lambda function implementing the standard 4-step rotation lifecycle.**:
   - Deploy rotation Lambda function implementing the standard 4-step rotation lifecycle.

3. **Generate fresh random password, update database user account via SQL ALTER USER, and verify login.**:
   - Generate fresh random password, update database user account via SQL ALTER USER, and verify login.

4. **Promote new credentials to AWSCURRENT staging label with zero application connection drops.**:
   - Promote new credentials to AWSCURRENT staging label with zero application connection drops.

## Recommended Tools & Environments
- AWS Secrets Manager
- AWS Lambda
- RDS PostgreSQL / MySQL
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
