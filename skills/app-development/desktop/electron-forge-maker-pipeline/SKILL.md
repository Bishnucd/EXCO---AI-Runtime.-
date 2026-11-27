---
name: electron-forge-maker-pipeline
description: Configures comprehensive desktop installers (.deb, .rpm, .dmg, Squirrel.Windows) using Electron Forge makers. Use when automating multi-format desktop installer packaging.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.electronforge.io/config/makers"
---
# Electron Forge Maker Pipeline

## Overview
Electron Forge provides a unified CLI and configuration toolchain to compile, package, and generate native platform installers across Linux, macOS, and Windows.

## Operational Workflow

1. **Configure forge.config.ts with maker plugins (@electron-forge/maker-squirrel, maker-zip, maker-deb).**:
   - Configure forge.config.ts with maker plugins (@electron-forge/maker-squirrel, maker-zip, maker-deb).

2. **Define application metadata, icons (.ico, .icns), and protocol registration associations.**:
   - Define application metadata, icons (.ico, .icns), and protocol registration associations.

3. **Execute electron-forge make targeting host platform distribution formats.**:
   - Execute electron-forge make targeting host platform distribution formats.

4. **Verify installed desktop binaries and desktop shortcut registrations on clean VMs.**:
   - Verify installed desktop binaries and desktop shortcut registrations on clean VMs.

## Recommended Tools & Environments
- Electron Forge
- Node.js
- Squirrel / WiX / Deb
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
