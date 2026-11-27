---
name: macos-universal-binary-lipo
description: Combines x86_64 and arm64 Apple Silicon executable slices into universal Mach-O binaries using lipo. Use when building single universal application bundles for macOS.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/documentation/apple-silicon/building-a-universal-macos-binary"
---
# Macos Universal Binary Lipo

## Overview
macOS runs on both Intel x86_64 and Apple Silicon arm64 hardware. Compiling both architecture slices and merging them with lipo creates a single application bundle running natively on all Macs.

## Operational Workflow

1. **Compile native binaries separately targeting x86_64-apple-macos and arm64-apple-macos.**:
   - Compile native binaries separately targeting x86_64-apple-macos and arm64-apple-macos.

2. **Merge architecture slices using lipo -create -output universal_bin bin_x86 bin_arm64.**:
   - Merge architecture slices using lipo -create -output universal_bin bin_x86 bin_arm64.

3. **Verify architecture slices using lipo -info to confirm presence of both x86_64 and arm64 targets.**:
   - Verify architecture slices using lipo -info to confirm presence of both x86_64 and arm64 targets.

4. **Sign and package universal executable inside the master .app bundle.**:
   - Sign and package universal executable inside the master .app bundle.

## Recommended Tools & Environments
- macOS
- lipo CLI
- Mach-O
- Clang

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
