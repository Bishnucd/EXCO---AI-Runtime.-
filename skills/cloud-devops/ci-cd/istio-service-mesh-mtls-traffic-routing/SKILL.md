---
name: istio-service-mesh-mtls-traffic-routing
description: Configures Istio service mesh mutual TLS (mTLS), canary traffic splitting, and fault injection. Use when securing and managing inter-service communication in Kubernetes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://istio.io/latest/docs/"
---
# Istio Service Mesh Mtls Traffic Routing

## Overview
Istio deploys Envoy sidecar proxies alongside application pods, providing automatic mutual TLS cryptographic encryption, fine-grained traffic routing, and distributed tracing without application code changes.

## Operational Workflow

1. **Enable automatic Istio sidecar injection on target Kubernetes namespaces.**:
   - Enable automatic Istio sidecar injection on target Kubernetes namespaces.

2. **Apply PeerAuthentication policy enforcing STRICT mutual TLS across all pod-to-pod communications.**:
   - Apply PeerAuthentication policy enforcing STRICT mutual TLS across all pod-to-pod communications.

3. **Author VirtualService and DestinationRule configuring 90/10 canary traffic splitting.**:
   - Author VirtualService and DestinationRule configuring 90/10 canary traffic splitting.

4. **Inject synthetic network latency and HTTP 503 faults to test application chaos resilience.**:
   - Inject synthetic network latency and HTTP 503 faults to test application chaos resilience.

## Recommended Tools & Environments
- Istio
- Envoy Proxy
- mTLS
- Kubernetes

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
