---
name: camera-hardware-qr-barcode-scanner
description: Configures high-speed native camera hardware feeds and barcode/QR detection using ML Kit or VisionKit. Use when building mobile scanning, ticketing, or physical item lookup interfaces.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/ml-kit/vision/barcode-scanning"
---
# Camera Hardware Qr Barcode Scanner

## Overview
Scanning QR codes requires configuring native camera preview streams, selecting optimal resolution targets, running machine vision models on frame buffers, and providing tactile haptic feedback.

## Operational Workflow

1. **Initialize CameraX (Android) or AVCaptureSession (iOS) with balanced 1080p stream resolution.**:
   - Initialize CameraX (Android) or AVCaptureSession (iOS) with balanced 1080p stream resolution.

2. **Feed camera frame image buffers into ML Kit BarcodeScanner or Vision framework detector.**:
   - Feed camera frame image buffers into ML Kit BarcodeScanner or Vision framework detector.

3. **Filter detected barcode formats (QR_CODE, EAN_13, CODE_128) to minimize CPU processing.**:
   - Filter detected barcode formats (QR_CODE, EAN_13, CODE_128) to minimize CPU processing.

4. **Trigger success haptic feedback and freeze camera frame upon valid barcode identification.**:
   - Trigger success haptic feedback and freeze camera frame upon valid barcode identification.

## Recommended Tools & Environments
- Google ML Kit
- Apple Vision / VisionKit
- CameraX / AVFoundation
- Mobile

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
