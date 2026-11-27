---
name: stripe-subscription-billing-webhook
description: Manages recurring Stripe subscription lifecycles, prorated upgrades, and failed payment dunning webhooks. Use when implementing SaaS recurring billing and subscription management.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.stripe.com/billing/subscriptions/overview"
---
# Stripe Subscription Billing Webhook

## Overview
SaaS billing requires handling trials, upgrades, cancellations, and payment failures. Integrating Stripe Subscriptions and listening to customer.subscription.* webhooks automates tenant access.

## Operational Workflow

1. **Create Stripe Checkout sessions for subscription plans with trial periods and customer portal access.**:
   - Create Stripe Checkout sessions for subscription plans with trial periods and customer portal access.

2. **Process customer.subscription.created and customer.subscription.updated webhook events.**:
   - Process customer.subscription.created and customer.subscription.updated webhook events.

3. **Handle invoice.payment_failed by entering grace periods and triggering dunning email sequences.**:
   - Handle invoice.payment_failed by entering grace periods and triggering dunning email sequences.

4. **Revoke tenant premium access upon customer.subscription.deleted lifecycle completion.**:
   - Revoke tenant premium access upon customer.subscription.deleted lifecycle completion.

## Recommended Tools & Environments
- Stripe API
- Stripe Billing
- Node.js / Python
- Webhooks

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
