---
name: streamlit-analytics-dashboard-layout
description: Builds interactive analytics web applications using Python Streamlit with caching and KPI metric cards. Use when deploying executive data apps and machine learning model explorers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.streamlit.io/"
---
# Streamlit Analytics Dashboard Layout

## Overview
Streamlit turns Python data scripts into shareable interactive web applications with native state management, st.cache_data performance caching, and reactive sidebar filters.

## Operational Workflow

1. **Structure Streamlit application with st.set_page_config and sidebar filter controls.**:
   - Structure Streamlit application with st.set_page_config and sidebar filter controls.

2. **Decorate data loading functions with @st.cache_data to cache database queries in memory.**:
   - Decorate data loading functions with @st.cache_data to cache database queries in memory.

3. **Render top-line KPI metrics with st.columns and st.metric cards showing period deltas.**:
   - Render top-line KPI metrics with st.columns and st.metric cards showing period deltas.

4. **Display interactive filtered dataframes and embedded charts with responsive redraws.**:
   - Display interactive filtered dataframes and embedded charts with responsive redraws.

## Recommended Tools & Environments
- Streamlit
- Python
- KPI Metrics
- Web Dashboard

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
