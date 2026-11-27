---
name: tauri-cross-compilation
description: Configures multi-platform Rust and web-view cross-compilation builds for lightweight desktop binaries using Tauri. Use when building resource-efficient native desktop apps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://tauri.app/v1/guides/building/cross-platform"
---
# Tauri Cross Compilation

## Overview
Tauri provides native webview rendering with a lightweight Rust backend, producing binaries under 15MB. Cross-compilation requires target toolchains, native library dependencies, and CI build matrices.

## Operational Workflow

1. **Configure tauri.conf.json with bundle identifiers, security capabilities, and CSP headers.**:
   - Configure tauri.conf.json with bundle identifiers, security capabilities, and CSP headers.

2. **Set up cross-compilation toolchains (x86_64, aarch64) using Cargo and cross.**:
   - Set up cross-compilation toolchains (x86_64, aarch64) using Cargo and cross.

3. **Manage native system dependencies (gtk3, webkit2gtk on Linux; Cocoa on macOS).**:
   - Manage native system dependencies (gtk3, webkit2gtk on Linux; Cocoa on macOS).

4. **Generate platform installers**:
   - Generate platform installers: .deb/.AppImage for Linux, .dmg for macOS, and .msi/.exe for Windows.

## Recommended Tools & Environments
- Rust
- Tauri v2
- Cargo
- GitHub Actions

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
