---
name: go-native-fuzz-testing-harness
description: Uncovers panics, memory corruptions, and crashes using Go 1.18+ native fuzzing harnesses (testing.F). Use when security testing network parsers, deserializers, and protocol codecs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://go.dev/doc/security/fuzz/"
---
# Go Native Fuzz Testing Harness

## Overview
Fuzz testing provides random, mutated byte inputs to Go functions to discover unhandled edge cases and panics. Go includes native coverage-guided fuzzing directly in the standard toolchain.

## Operational Workflow

1. **Write fuzz target function**:
   - Write fuzz target function: func FuzzParse(f *testing.F) adding seed corpus samples via f.Add().

2. **Execute fuzz iteration runner**:
   - Execute fuzz iteration runner: f.Fuzz(func(t *testing.T, data []byte) { Parse(data) }).

3. **Run go test -fuzz=FuzzParse -fuzztime=5m to execute millions of mutated iterations.**:
   - Run go test -fuzz=FuzzParse -fuzztime=5m to execute millions of mutated iterations.

4. **When a crash is discovered, inspect the recorded testdata artifact and fix the panicking boundary condition.**:
   - When a crash is discovered, inspect the recorded testdata artifact and fix the panicking boundary condition.

## Recommended Tools & Environments
- Go Fuzzing
- testing.F
- Security Testing
- Go (Golang)

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
