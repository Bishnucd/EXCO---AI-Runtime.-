---
name: fuzz-testing-input-generator
description: Executes coverage-guided fuzz testing using libFuzzer or Go native fuzzing to uncover memory corruption and crashes. Use when hardening security-critical data decoders and network protocol parsers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://go.dev/security/fuzz/"
---
# Fuzz Testing Input Generator

## Overview
Fuzzing injects mutated byte payloads while monitoring code execution paths to discover deep edge-case crashes, memory panics, and buffer overflows that standard unit tests never reach.

## Operational Workflow

1. **Author fuzz target function accepting raw byte slices ([]byte) and feeding target decoders.**:
   - Author fuzz target function accepting raw byte slices ([]byte) and feeding target decoders.

2. **Seed fuzzing corpus with sample valid input files.**:
   - Seed fuzzing corpus with sample valid input files.

3. **Execute coverage-guided fuzz engine (go test -fuzz=FuzzTarget) over millions of iterations.**:
   - Execute coverage-guided fuzz engine (go test -fuzz=FuzzTarget) over millions of iterations.

4. **Inspect crashing payload artifacts, minimize input inputs, and add regression tests.**:
   - Inspect crashing payload artifacts, minimize input inputs, and add regression tests.

## Recommended Tools & Environments
- Go Fuzzing
- libFuzzer
- AFL++
- C / Go / Rust

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
