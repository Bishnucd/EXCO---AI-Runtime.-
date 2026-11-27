---
name: stripe-customer-portal-session-checkout
description: Integrates Stripe Customer Portal sessions for self-service subscription management and billing updates. Use when allowing SaaS customers to manage invoices, cards, and tier upgrades.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://stripe.com/docs/billing/subscriptions/integrating-customer-portal"
---
# Stripe Customer Portal Session Checkout

## Overview
Building custom subscription management UIs (updating credit cards, downloading PDF invoices, switching plans) takes weeks. Stripe Customer Portal provides a secure, hosted self-service portal.

## Operational Workflow

1. **Retrieve authenticated user stripe_customer_id from application database.**:
   - Retrieve authenticated user stripe_customer_id from application database.

2. **Create portal session via stripe.billingPortal.sessions.create({ customer, return_url }).**:
   - Create portal session via stripe.billingPortal.sessions.create({ customer, return_url }).

3. **Redirect user to generated session.url where they can manage payment methods and plans.**:
   - Redirect user to generated session.url where they can manage payment methods and plans.

4. **Listen for customer.subscription.updated and customer.subscription.deleted webhooks to sync app permissions.**:
   - Listen for customer.subscription.updated and customer.subscription.deleted webhooks to sync app permissions.

## Recommended Tools & Environments
- Stripe Billing
- Customer Portal
- Stripe API
- SaaS Subscriptions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
