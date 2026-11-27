---
name: ses-configuration-set-event-publishing
description: Routes Amazon SES email delivery, bounce, and complaint telemetry to Kinesis and SNS topics. Use when building enterprise email analytics and deliverability monitoring pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/ses/latest/dg/using-configuration-sets.html"
---
# Ses Configuration Set Event Publishing

## Overview
Amazon SES Configuration Sets allow granular tracking of email events. Routing event metrics to Kinesis streams enables real-time analytics dashboards and automatic sender pause rules.

## Operational Workflow

1. **Create SES Configuration Set and attach event destinations (SNS, Kinesis Firehose, CloudWatch).**:
   - Create SES Configuration Set and attach event destinations (SNS, Kinesis Firehose, CloudWatch).

2. **Pass ConfigurationSetName parameter in outbound SendEmail API invocations.**:
   - Pass ConfigurationSetName parameter in outbound SendEmail API invocations.

3. **Stream real-time delivery, bounce, open, click, and complaint records into analytical data lakes.**:
   - Stream real-time delivery, bounce, open, click, and complaint records into analytical data lakes.

4. **Configure CloudWatch alarms triggering automated sender pauses when complaint rate exceeds 0.1%.**:
   - Configure CloudWatch alarms triggering automated sender pauses when complaint rate exceeds 0.1%.

## Recommended Tools & Environments
- Amazon SES
- AWS SNS / Kinesis
- CloudWatch
- Terraform

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
