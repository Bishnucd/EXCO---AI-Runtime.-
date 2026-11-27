---
name: wix-toolset-msi-installer
description: Authors WiX XML source files to compile enterprise Windows MSI installers with custom actions and registry keys. Use when creating enterprise-grade Windows installation packages.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://wixtoolset.org/docs/intro/"
---
# Wix Toolset Msi Installer

## Overview
Enterprise IT departments mandate MSI packages for silent deployment via Active Directory or Intune. WiX Toolset compiles declarative XML markup into Windows Installer databases.

## Operational Workflow

1. **Author Product.wxs file defining UpgradeCode, Package, ComponentGroup, and Directory layout.**:
   - Author Product.wxs file defining UpgradeCode, Package, ComponentGroup, and Directory layout.

2. **Define component GUIDs and bind application executables, shortcuts, and registry entries.**:
   - Define component GUIDs and bind application executables, shortcuts, and registry entries.

3. **Compile and link WiX source files using wix build to produce verified MSI binaries.**:
   - Compile and link WiX source files using wix build to produce verified MSI binaries.

4. **Test silent installation and uninstallation via msiexec /i installer.msi /qn.**:
   - Test silent installation and uninstallation via msiexec /i installer.msi /qn.

## Recommended Tools & Environments
- WiX Toolset v4
- Windows Installer (MSI)
- XML
- PowerShell

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
