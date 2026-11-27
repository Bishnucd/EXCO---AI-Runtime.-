---
name: location-geofencing-background-tracking
description: Configures low-power mobile geofencing, significant motion changes, and background location services. Use when triggering location-based alerts and tracking mobile journeys.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/documentation/corelocation/monitoring_the_user_s_proximity_to_geographic_regions"
---
# Location Geofencing Background Tracking

## Overview
Continuous GPS tracking rapidly drains smartphone batteries. Leveraging OS-managed hardware geofencing and significant location change APIs enables battery-efficient boundary monitoring.

## Operational Workflow

1. **Request appropriate location authorization (WhenInUse vs Always / Background).**:
   - Request appropriate location authorization (WhenInUse vs Always / Background).

2. **Register geographic circular regions (latitude, longitude, radius) with native location manager.**:
   - Register geographic circular regions (latitude, longitude, radius) with native location manager.

3. **Configure native broadcast receivers handling enter and exit transition events in the background.**:
   - Configure native broadcast receivers handling enter and exit transition events in the background.

4. **Throttle GPS polling intervals dynamically based on device accelerometer activity.**:
   - Throttle GPS polling intervals dynamically based on device accelerometer activity.

## Recommended Tools & Environments
- CoreLocation (iOS)
- FusedLocationProvider (Android)
- Geofencing
- Battery Optimization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
