---
name: vault-agent-sidecar-secret-injector
description: Injects dynamic database credentials and secrets into Kubernetes pods using HashiCorp Vault Agent sidecars. Use when eliminating hardcoded static secrets in cloud applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.hashicorp.com/vault/docs/platform/k8s/injector"
---
# Vault Agent Sidecar Secret Injector

## Overview
Hardcoded secrets in environment variables leak into crash logs and child processes. Vault Agent sidecars authenticate via Kubernetes ServiceAccounts and write ephemeral dynamic secrets to in-memory ramdisks.

## Operational Workflow

1. **Annotate application Pod with vault.hashicorp.com/agent-inject**:
   - Annotate application Pod with vault.hashicorp.com/agent-inject: "true".

2. **Specify secret path**:
   - Specify secret path: vault.hashicorp.com/agent-inject-secret-db: "database/creds/app-role".

3. **Vault mutating webhook injects init and sidecar containers into pod specification.**:
   - Vault mutating webhook injects init and sidecar containers into pod specification.

4. **Sidecar authenticates with Vault, writes secrets to shared /vault/secrets/ in-memory volume, and auto-renews leases.**:
   - Sidecar authenticates with Vault, writes secrets to shared /vault/secrets/ in-memory volume, and auto-renews leases.

## Recommended Tools & Environments
- HashiCorp Vault
- Kubernetes Mutating Webhook
- Vault Agent
- Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
