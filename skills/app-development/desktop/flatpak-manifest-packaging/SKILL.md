---
name: flatpak-manifest-packaging
description: Constructs sandboxed Flatpak application manifests with runtime permissions and Flathub distribution recipes. Use when packaging desktop Linux applications for universal distribution.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.flatpak.org/en/latest/"
---
# Flatpak Manifest Packaging

## Overview
Linux fragmentation makes packaging difficult. Flatpak creates isolated sandbox runtimes that run identically across Ubuntu, Fedora, Arch, and SteamOS with explicit permission portals.

## Operational Workflow

1. **Define YAML/JSON Flatpak manifest specifying app-id, runtime (Freedesktop/GNOME), and SDK.**:
   - Define YAML/JSON Flatpak manifest specifying app-id, runtime (Freedesktop/GNOME), and SDK.

2. **Declare sandbox permission finishes (e.g. --socket=wayland, --socket=pulseaudio, --filesystem=host).**:
   - Declare sandbox permission finishes (e.g. --socket=wayland, --socket=pulseaudio, --filesystem=host).

3. **Build and bundle application using flatpak-builder.**:
   - Build and bundle application using flatpak-builder.

4. **Validate manifest against Flathub automated quality standards and portal constraints.**:
   - Validate manifest against Flathub automated quality standards and portal constraints.

## Recommended Tools & Environments
- Flatpak
- Flathub
- OSTree
- Linux

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
