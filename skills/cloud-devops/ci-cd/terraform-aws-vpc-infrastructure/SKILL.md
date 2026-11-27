---
name: terraform-aws-vpc-infrastructure
description: Provisions modular, multi-AZ VPC network infrastructure with private and public subnets via Terraform. Use when deploying secure foundational cloud network infrastructure on AWS.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest"
---
# Terraform Aws Vpc Infrastructure

## Overview
Production cloud architectures require isolated public and private subnet topologies across at least two Availability Zones with managed NAT Gateways for outbound egress.

## Operational Workflow

1. **Declare VPC CIDR block and map private, public, and database subnet allocations across AZs.**:
   - Declare VPC CIDR block and map private, public, and database subnet allocations across AZs.

2. **Configure Internet Gateways for public subnets and managed NAT Gateways for private subnets.**:
   - Configure Internet Gateways for public subnets and managed NAT Gateways for private subnets.

3. **Define route tables enforcing strict traffic segregation between tiers.**:
   - Define route tables enforcing strict traffic segregation between tiers.

4. **Enable VPC flow logs streaming to AWS CloudWatch for network auditing.**:
   - Enable VPC flow logs streaming to AWS CloudWatch for network auditing.

## Recommended Tools & Environments
- Terraform / OpenTofu
- AWS VPC
- NAT Gateway
- HCL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
