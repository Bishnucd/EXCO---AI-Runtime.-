---
name: exif-metadata-tampering-forensic-audit
description: Audits image and document metadata timestamps, GPS discrepancies, and software edit history for forensic tampering. Use when authenticating digital photographic evidence.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Digital_image_forensics"
---
# Exif Metadata Tampering Forensic Audit

## Overview
Digital photos store internal timestamps, camera serials, and thumbnail caches. Forensic audits compare EXIF creation times against file system timestamps and software edit tags to detect forgery.

## Operational Workflow

1. **Extract comprehensive metadata tree using ExifTool with all hidden proprietary maker notes.**:
   - Extract comprehensive metadata tree using ExifTool with all hidden proprietary maker notes.

2. **Compare DateTimeOriginal, CreateDate, and ModifyDate to detect chronological inconsistencies.**:
   - Compare DateTimeOriginal, CreateDate, and ModifyDate to detect chronological inconsistencies.

3. **Inspect Software metadata tags for evidence of editing tools (Photoshop, GIMP) vs native camera firmware.**:
   - Inspect Software metadata tags for evidence of editing tools (Photoshop, GIMP) vs native camera firmware.

4. **Extract and visually compare embedded EXIF preview thumbnail to full image to verify no cropped or spliced objects.**:
   - Extract and visually compare embedded EXIF preview thumbnail to full image to verify no cropped or spliced objects.

## Recommended Tools & Environments
- EXIF Forensics
- ExifTool
- Timestamp Audit
- Image Forensics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
