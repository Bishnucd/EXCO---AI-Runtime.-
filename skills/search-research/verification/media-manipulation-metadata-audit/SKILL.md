---
name: media-manipulation-metadata-audit
description: Inspects image and video EXIF/XMP metadata, compression artifacts, and reverse visual search traces for manipulation. Use when authenticating digital media assets and verifying photo origins.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://exiftool.org/"
---
# Media Manipulation Metadata Audit

## Overview
Digital media can be misattributed, AI-generated, or edited. Auditing camera EXIF metadata, GPS timestamps, and Error Level Analysis (ELA) identifies digital alteration and original publication dates.

## Operational Workflow

1. **Extract raw EXIF, IPTC, and XMP metadata tags using ExifTool.**:
   - Extract raw EXIF, IPTC, and XMP metadata tags using ExifTool.

2. **Inspect metadata for camera hardware serials, capture timestamps, and software editing signatures.**:
   - Inspect metadata for camera hardware serials, capture timestamps, and software editing signatures.

3. **Perform reverse image queries across Google Images, TinEye, and Yandex to locate earliest appearances.**:
   - Perform reverse image queries across Google Images, TinEye, and Yandex to locate earliest appearances.

4. **Execute Error Level Analysis to detect regions with inconsistent JPEG compression block artifacts.**:
   - Execute Error Level Analysis to detect regions with inconsistent JPEG compression block artifacts.

## Recommended Tools & Environments
- ExifTool
- Reverse Image Search
- Error Level Analysis (ELA)
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
