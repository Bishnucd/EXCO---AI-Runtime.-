---
name: electron-auto-updater-pipeline
description: Configures secure, differential auto-update pipelines for Electron desktop applications using electron-updater. Use when implementing seamless background updates for desktop software.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.electron.build/auto-update"
---
# Electron Auto Updater Pipeline

## Overview
Desktop applications require background update checks, cryptographic signature verification, differential binary downloads, and restart prompts to ensure users run secure, current versions.

## Operational Workflow

1. **Configure electron-builder publish configuration pointing to release distribution buckets.**:
   - Configure electron-builder publish configuration pointing to release distribution buckets.

2. **Initialize electron-updater in the main process with event hooks for update-available and update-downloaded.**:
   - Initialize electron-updater in the main process with event hooks for update-available and update-downloaded.

3. **Implement code-signing verification to ensure untampered binary execution.**:
   - Implement code-signing verification to ensure untampered binary execution.

4. **Present non-intrusive UI notifications allowing users to restart immediately or upon exit.**:
   - Present non-intrusive UI notifications allowing users to restart immediately or upon exit.

## Recommended Tools & Environments
- Electron
- electron-builder
- electron-updater
- GitHub Releases / S3

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
