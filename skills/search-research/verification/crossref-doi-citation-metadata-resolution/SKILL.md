---
name: crossref-doi-citation-metadata-resolution
description: Resolves Digital Object Identifiers (DOIs) to canonical academic metadata and citation counts via Crossref REST API. Use when validating academic citations and preventing phantom references.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/"
---
# Crossref Doi Citation Metadata Resolution

## Overview
AI models frequently invent fake academic paper titles and authors. Crossref REST API queries canonical publisher records to verify that a DOI exists, matching declared authors, journals, and publication dates.

## Operational Workflow

1. **Extract DOI string from cited paper reference (e.g., 10.1038/s41586-020-2649-2).**:
   - Extract DOI string from cited paper reference (e.g., 10.1038/s41586-020-2649-2).

2. **Execute GET query to Crossref API**:
   - Execute GET query to Crossref API: https://api.crossref.org/works/{doi} with polite User-Agent header.

3. **Parse returned JSON metadata verifying paper title, author list, journal title, volume, and year.**:
   - Parse returned JSON metadata verifying paper title, author list, journal title, volume, and year.

4. **Flag citation as hallucinated or corrupted if Crossref returns 404 Not Found or mismatched title.**:
   - Flag citation as hallucinated or corrupted if Crossref returns 404 Not Found or mismatched title.

## Recommended Tools & Environments
- Crossref REST API
- DOI Resolution
- Academic Citation Verification
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
