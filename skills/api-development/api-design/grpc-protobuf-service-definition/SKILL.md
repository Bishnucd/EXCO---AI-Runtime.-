---
name: grpc-protobuf-service-definition
description: Authors protocol buffer service contracts and message definitions with backwards-compatibility checks. Use when designing low-latency, high-throughput microservice communication interfaces.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://protobuf.dev/programming-guides/proto3/"
---
# Grpc Protobuf Service Definition

## Overview
gRPC over HTTP/2 provides binary serialization, strongly-typed contracts, and bidirectional streaming. Proto3 definitions must adhere to field tag preservation rules for zero-downtime evolution.

## Operational Workflow

1. **Draft proto3 message definitions assigning unique immutable integer field tags.**:
   - Draft proto3 message definitions assigning unique immutable integer field tags.

2. **Define RPC method signatures for unary, server streaming, client streaming, and bidirectional flows.**:
   - Define RPC method signatures for unary, server streaming, client streaming, and bidirectional flows.

3. **Run buf lint to enforce consistent protobuf naming standards and field numbering.**:
   - Run buf lint to enforce consistent protobuf naming standards and field numbering.

4. **Execute buf breaking against the previous git release commit to prevent backwards-incompatible breaking changes.**:
   - Execute buf breaking against the previous git release commit to prevent backwards-incompatible breaking changes.

## Recommended Tools & Environments
- Protocol Buffers proto3
- gRPC
- buf CLI
- Go / Python / Java

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
