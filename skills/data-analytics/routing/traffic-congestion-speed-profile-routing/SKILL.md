---
name: traffic-congestion-speed-profile-routing
description: Integrates historical and real-time traffic speed profiles to compute accurate time-dependent routing routes. Use when forecasting commute times across peak rush hour traffic periods.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/Project-OSRM/osrm-backend/wiki/Traffic"
---
# Traffic Congestion Speed Profile Routing

## Overview
Routing on static speed limits produces wildly inaccurate travel time estimates during rush hour. Ingesting floating-car speed records updates road edge weights with realistic speeds.

## Operational Workflow

1. **Ingest real-time or historical hourly speed observations for road segments.**:
   - Ingest real-time or historical hourly speed observations for road segments.

2. **Format speed file**:
   - Format speed file: from_osm_id,to_osm_id,speed_in_kmh.

3. **Execute osrm-contract or customize step applying updated speed weights to routing graph.**:
   - Execute osrm-contract or customize step applying updated speed weights to routing graph.

4. **Query route directions returning departure-time dependent travel duration forecasts.**:
   - Query route directions returning departure-time dependent travel duration forecasts.

## Recommended Tools & Environments
- OSRM Traffic Update
- Speed Profiles
- CSV / CSV.gz
- Traffic Telemetry

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
