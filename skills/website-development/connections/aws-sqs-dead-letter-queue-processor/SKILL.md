---
name: aws-sqs-dead-letter-queue-processor
description: Implements Amazon SQS message consumption with Dead Letter Queues (DLQ) and exponential redrive. Use when building resilient asynchronous microservice message pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"
---
# Aws Sqs Dead Letter Queue Processor

## Overview
Poison pill messages can crash queue consumers repeatedly. Dead Letter Queues isolate failing messages after maximum receive counts, allowing inspection while keeping the main queue flowing.

## Operational Workflow

1. **Configure SQS source queue with RedrivePolicy setting maxReceiveCount (e.g., 5 attempts) pointing to DLQ.**:
   - Configure SQS source queue with RedrivePolicy setting maxReceiveCount (e.g., 5 attempts) pointing to DLQ.

2. **Implement consumer worker polling messages with long polling (WaitTimeSeconds = 20).**:
   - Implement consumer worker polling messages with long polling (WaitTimeSeconds = 20).

3. **Process message inside try/catch**:
   - Process message inside try/catch: deleteMessage upon success; leave on queue on transient failure.

4. **Set up CloudWatch alert on DLQ ApproximateNumberOfMessagesVisible > 0 to trigger engineer investigation.**:
   - Set up CloudWatch alert on DLQ ApproximateNumberOfMessagesVisible > 0 to trigger engineer investigation.

## Recommended Tools & Environments
- AWS SQS
- Dead Letter Queue (DLQ)
- Message Redrive
- Cloud Messaging

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
