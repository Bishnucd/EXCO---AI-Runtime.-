---
name: exiftool-metadata-sanitization-pipeline
description: Strips sensitive GPS locations, device serial numbers, and thumbnail caches from image batches using ExifTool. Use when sanitizing media files prior to public web publication.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://exiftool.org/"
---
# Exiftool Metadata Sanitization Pipeline

## Overview
Images taken by smartphones embed precise GPS home coordinates, facial recognition tags, and unique camera hardware IDs. ExifTool strips all personal data while preserving color profiles.

## Operational Workflow

1. **Inspect existing image metadata tags using exiftool -a -u -g1 image.jpg.**:
   - Inspect existing image metadata tags using exiftool -a -u -g1 image.jpg.

2. **Execute batch sanitization command**:
   - Execute batch sanitization command: exiftool -all= --icc_profile:all -overwrite_original *.jpg.

3. **Preserve essential color space profile (ICC) to prevent colors from shifting on web displays.**:
   - Preserve essential color space profile (ICC) to prevent colors from shifting on web displays.

4. **Verify that all GPS latitude, longitude, and device serial numbers are permanently purged.**:
   - Verify that all GPS latitude, longitude, and device serial numbers are permanently purged.

## Recommended Tools & Environments
- ExifTool
- Privacy Protection
- EXIF Sanitization
- CLI Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
