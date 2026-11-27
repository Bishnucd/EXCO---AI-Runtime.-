---
name: terraform-remote-state-s3-dynamodb-locking
description: Configures secure remote Terraform state storage in AWS S3 with state locking via DynamoDB. Use when enabling collaborative, race-condition-free infrastructure as code.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.hashicorp.com/terraform/language/settings/backends/s3"
---
# Terraform Remote State S3 Dynamodb Locking

## Overview
Storing Terraform state locally risks data loss and concurrent conflicting apply operations. Storing state in versioned S3 buckets with DynamoDB locking prevents simultaneous mutations.

## Operational Workflow

1. **Create encrypted, versioned AWS S3 bucket with public access blocks for state storage.**:
   - Create encrypted, versioned AWS S3 bucket with public access blocks for state storage.

2. **Create DynamoDB table with LockID string primary key attribute.**:
   - Create DynamoDB table with LockID string primary key attribute.

3. **Declare backend "s3" configuration block in root Terraform module.**:
   - Declare backend "s3" configuration block in root Terraform module.

4. **Execute terraform init to migrate local state files into encrypted remote storage.**:
   - Execute terraform init to migrate local state files into encrypted remote storage.

## Recommended Tools & Environments
- Terraform
- AWS S3
- AWS DynamoDB
- HCL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
