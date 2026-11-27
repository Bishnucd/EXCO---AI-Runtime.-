---
name: libpostal-international-address-parser
description: Parses and normalizes unstructured international street addresses using the libpostal C library and NLP models. Use when deduplicating messy global address databases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/openvenues/libpostal"
---
# Libpostal International Address Parser

## Overview
International address formats vary wildly across countries. libpostal uses statistical language models trained on OpenStreetMap data to decompose messy strings into discrete components.

## Operational Workflow

1. **Pass unformatted international address string into postal.parser.parse_address().**:
   - Pass unformatted international address string into postal.parser.parse_address().

2. **Extract standardized tokens**:
   - Extract standardized tokens: house_number, road, suburb, city, state, postcode, country.

3. **Expand abbreviations (St -> Street, Apt -> Apartment) using normalize_address().**:
   - Expand abbreviations (St -> Street, Apt -> Apartment) using normalize_address().

4. **Generate normalized composite address hashes for database deduplication.**:
   - Generate normalized composite address hashes for database deduplication.

## Recommended Tools & Environments
- libpostal
- C / Python bindings
- Address Parsing
- NLP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
