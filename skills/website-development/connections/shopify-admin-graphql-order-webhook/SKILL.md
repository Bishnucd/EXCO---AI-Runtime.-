---
name: shopify-admin-graphql-order-webhook
description: Ingests Shopify order fulfillment events and queries Admin GraphQL API for inventory sync. Use when integrating e-commerce backends with Shopify merchant stores.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://shopify.dev/docs/api/admin-graphql"
---
# Shopify Admin Graphql Order Webhook

## Overview
Connecting to Shopify requires listening to order/fulfillment webhooks and querying the Shopify Admin GraphQL API to synchronize inventory, fulfill orders, and update customer profiles.

## Operational Workflow

1. **Register webhook subscription for orders/create and orders/fulfilled topics in Shopify Partner dashboard.**:
   - Register webhook subscription for orders/create and orders/fulfilled topics in Shopify Partner dashboard.

2. **Verify X-Shopify-Hmac-SHA256 signature header using Shopify shared secret in webhook endpoint.**:
   - Verify X-Shopify-Hmac-SHA256 signature header using Shopify shared secret in webhook endpoint.

3. **Query Shopify Admin GraphQL API using authenticated access token to fetch full line item details.**:
   - Query Shopify Admin GraphQL API using authenticated access token to fetch full line item details.

4. **Execute inventory reconciliation mutations across warehouse management systems.**:
   - Execute inventory reconciliation mutations across warehouse management systems.

## Recommended Tools & Environments
- Shopify Admin GraphQL
- Webhooks
- E-Commerce Integration
- HMAC Verification

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
