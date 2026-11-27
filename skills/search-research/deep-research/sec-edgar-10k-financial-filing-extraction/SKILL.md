---
name: sec-edgar-10k-financial-filing-extraction
description: Extracts Item 1A (Risk Factors), MD&A, and consolidated financials from SEC EDGAR 10-K/10-Q corporate filings. Use when performing deep competitive financial analysis and regulatory risk audits.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.sec.gov/edgar/searchedgar/companysearch"
---
# Sec Edgar 10k Financial Filing Extraction

## Overview
SEC EDGAR filings provide audited corporate disclosures. Systematically extracting Item 1 (Business), Item 1A (Risk Factors), and Item 7 (MD&A) reveals hidden competitive risks and financial trajectories.

## Operational Workflow

1. **Query SEC EDGAR API using company CIK number to download latest annual 10-K and quarterly 10-Q filings.**:
   - Query SEC EDGAR API using company CIK number to download latest annual 10-K and quarterly 10-Q filings.

2. **Parse filing HTML/XBRL into structured sections using BeautifulSoup or sec-parser.**:
   - Parse filing HTML/XBRL into structured sections using BeautifulSoup or sec-parser.

3. **Extract Item 1A Risk Factors and compare year-over-year text deltas to detect emerging legal/cyber risks.**:
   - Extract Item 1A Risk Factors and compare year-over-year text deltas to detect emerging legal/cyber risks.

4. **Extract consolidated balance sheet, income statement, and cash flow tables into financial analysis models.**:
   - Extract consolidated balance sheet, income statement, and cash flow tables into financial analysis models.

## Recommended Tools & Environments
- SEC EDGAR
- 10-K / 10-Q Filings
- Financial Analysis
- Python / sec-edgar-downloader

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
