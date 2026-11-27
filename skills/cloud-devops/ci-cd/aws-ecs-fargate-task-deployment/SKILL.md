---
name: aws-ecs-fargate-task-deployment
description: Defines modular AWS ECS Fargate task definitions, service configurations, and Application Load Balancer target groups. Use when running serverless containers on AWS without managing EC2 nodes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
---
# Aws Ecs Fargate Task Deployment

## Overview
AWS Fargate runs containers serverless without managing underlying EC2 virtual machines. Task definitions specify container images, CPU/RAM allocations, IAM task execution roles, and logging.

## Operational Workflow

1. **Define ECS Task Definition with awsvpc network mode, Fargate compatibility, and CloudWatch logs.**:
   - Define ECS Task Definition with awsvpc network mode, Fargate compatibility, and CloudWatch logs.

2. **Attach Task Execution IAM Role granting permissions to pull from ECR and read Secrets Manager.**:
   - Attach Task Execution IAM Role granting permissions to pull from ECR and read Secrets Manager.

3. **Configure ECS Service with desired task count, rolling update deployments, and minimum healthy percent.**:
   - Configure ECS Service with desired task count, rolling update deployments, and minimum healthy percent.

4. **Bind service target group to Application Load Balancer with path-based routing rules.**:
   - Bind service target group to Application Load Balancer with path-based routing rules.

## Recommended Tools & Environments
- AWS ECS
- AWS Fargate
- Terraform / CloudFormation
- Docker

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
