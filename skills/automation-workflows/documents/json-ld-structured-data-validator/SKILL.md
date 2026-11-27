---
name: json-ld-structured-data-validator
description: Validates and injects Schema.org JSON-LD structured data into HTML documents for Google Rich Results. Use when optimizing web document metadata for search engine indexing.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://schema.org/docs/documents.html"
---
# Json Ld Structured Data Validator

## Overview
Search engines rely on JSON-LD script tags to display rich snippets (breadcrumbs, reviews, FAQs). Validating schemas against Schema.org models ensures eligibility for enhanced search placement.

## Operational Workflow

1. **Construct JSON-LD object with @context**:
   - Construct JSON-LD object with @context: "https://schema.org" and target @type (Article, Product).

2. **Populate mandatory and recommended properties with structured dates, authors, and prices.**:
   - Populate mandatory and recommended properties with structured dates, authors, and prices.

3. **Inject <script type="application/ld+json"> tag into HTML document <head>.**:
   - Inject <script type="application/ld+json"> tag into HTML document <head>.

4. **Validate payload against Google Rich Results schema criteria to verify zero errors.**:
   - Validate payload against Google Rich Results schema criteria to verify zero errors.

## Recommended Tools & Environments
- JSON-LD
- Schema.org
- Search Console API
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
