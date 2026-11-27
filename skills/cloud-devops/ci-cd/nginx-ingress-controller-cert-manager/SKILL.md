---
name: nginx-ingress-controller-cert-manager
description: Configures ingress-nginx with cert-manager for automatic Let's Encrypt TLS certificate generation and renewal. Use when provisioning HTTPS endpoints for Kubernetes microservices.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cert-manager.io/docs/usage/ingress/"
---
# Nginx Ingress Controller Cert Manager

## Overview
Manually renewing TLS certificates causes catastrophic production outages. cert-manager automates ACME HTTP-01 and DNS-01 challenges, obtaining and rotating Let's Encrypt certificates automatically.

## Operational Workflow

1. **Deploy cert-manager CRDs and configure Let's Encrypt ClusterIssuer.**:
   - Deploy cert-manager CRDs and configure Let's Encrypt ClusterIssuer.

2. **Annotate Ingress resources with cert-manager.io/cluster-issuer**:
   - Annotate Ingress resources with cert-manager.io/cluster-issuer: letsencrypt-prod.

3. **cert-manager provisions ACME challenge pods and validates domain ownership with Let's Encrypt.**:
   - cert-manager provisions ACME challenge pods and validates domain ownership with Let's Encrypt.

4. **Store issued TLS certificate and private key in Kubernetes Secret and bind to Ingress tls block.**:
   - Store issued TLS certificate and private key in Kubernetes Secret and bind to Ingress tls block.

## Recommended Tools & Environments
- ingress-nginx
- cert-manager
- Let's Encrypt ACME
- Kubernetes

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
