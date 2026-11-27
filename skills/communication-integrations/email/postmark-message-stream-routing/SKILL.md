---
name: postmark-message-stream-routing
description: Segregates transactional messages from promotional broadcasts using Postmark Message Streams and distinct IPs. Use when safeguarding critical password reset delivery rates.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://postmarkapp.com/developer/user-guide/message-streams"
---
# Postmark Message Stream Routing

## Overview
Sending marketing newsletters from the same IP as password resets risks delaying critical logins when marketing blasts cause throttling. Postmark message streams physically isolate traffic.

## Operational Workflow

1. **Create separate Transactional and Broadcast Message Streams in Postmark.**:
   - Create separate Transactional and Broadcast Message Streams in Postmark.

2. **Route password resets, receipts, and security alerts through Transactional Stream.**:
   - Route password resets, receipts, and security alerts through Transactional Stream.

3. **Route monthly newsletters and marketing announcements through Broadcast Stream.**:
   - Route monthly newsletters and marketing announcements through Broadcast Stream.

4. **Monitor separate deliverability metrics and bounce rates per message stream.**:
   - Monitor separate deliverability metrics and bounce rates per message stream.

## Recommended Tools & Environments
- Postmark API
- Message Streams
- REST
- Deliverability

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
