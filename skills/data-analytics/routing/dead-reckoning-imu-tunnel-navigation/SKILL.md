---
name: dead-reckoning-imu-tunnel-navigation
description: Estimates vehicle position inside GPS-denied tunnels using smartphone accelerometer, gyroscope, and wheel speed dead reckoning. Use when maintaining continuous navigation in underground tunnels.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Dead_reckoning"
---
# Dead Reckoning Imu Tunnel Navigation

## Overview
GPS signals vanish inside underground highway tunnels. Dead reckoning fuses IMU accelerometer readings, heading compass gyroscopes, and last known speed to project vehicle movement until GPS restores.

## Operational Workflow

1. **Detect GPS signal loss and transition navigation state to inertial dead reckoning mode.**:
   - Detect GPS signal loss and transition navigation state to inertial dead reckoning mode.

2. **Integrate accelerometer forward acceleration vectors to estimate vehicle speed.**:
   - Integrate accelerometer forward acceleration vectors to estimate vehicle speed.

3. **Integrate gyroscope angular velocity to track vehicle steering heading through curves.**:
   - Integrate gyroscope angular velocity to track vehicle steering heading through curves.

4. **Fuse dead-reckoning position along the known 3D tunnel roadway geometry polyline.**:
   - Fuse dead-reckoning position along the known 3D tunnel roadway geometry polyline.

## Recommended Tools & Environments
- Dead Reckoning
- Inertial Measurement Unit (IMU)
- Extended Kalman Filter (EKF)
- Mobile

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
