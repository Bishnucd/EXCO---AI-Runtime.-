---
name: app-packaging-signing
description: Packages and signs a desktop application (Electron, Tauri, or a native bundle) for Windows, macOS, and Linux, producing installers, an auto-update feed, and a signing and notarisation checklist. Use when shipping a desktop build, setting up code signing, or fixing an installer that is blocked by SmartScreen or Gatekeeper.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# App Packaging and Signing

Produces installable, signed artefacts for each target OS, plus the update metadata an
auto-updater needs. Signing is the part that most often blocks a release, so it is treated
as a first-class step, not an afterthought.

## When to use

- First desktop release of an Electron or Tauri app.
- Users report "Windows protected your PC" or "app is damaged and can't be opened".
- Setting up auto-update.
- Adding a new target platform.

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Framework | yes | Electron, Tauri, or native |
| Targets | yes | win-x64, win-arm64, mac-arm64, mac-x64, linux-x64, etc. |
| Signing identity | conditional | Required for distribution; absence changes the plan |
| Update strategy | no | GitHub Releases, S3, or self-hosted |

## Workflow

### 1. Establish the release contract

Write down: product name, app ID (reverse-DNS), version, publisher name, and the update
channel. These appear in the installer, the registry/uninstall entry, and the update feed —
changing them later breaks upgrades.

### 2. Prepare build configuration

**Electron** — use `electron-builder` or `electron-forge`. Set in config:

- `appId`, `productName`, `directories.output`
- `files` allowlist (never ship `node_modules` wholesale; use `asar` and an explicit
  `files` list)
- `asarUnpack` for native modules that must live on disk
- Per-target `target` entries (`nsis`, `dmg`, `AppImage`, `deb`)

**Tauri** — configure `bundle.targets` and `bundle.identifier` in `tauri.conf.json`; keep
the `productName` stable across releases.

### 3. Build reproducibly

- Pin the toolchain version and lockfile; commit both.
- Build each target on its native OS or a matching CI runner. Cross-compiling macOS from
  Linux cannot be notarised.
- Record the exact command per target in `RELEASE.md`.

### 4. Sign

| Platform | What is required | Verification |
|----------|------------------|--------------|
| Windows | Authenticode certificate (OV or EV) or Azure Trusted Signing; timestamp the signature | `signtool verify /pa /v <file>` |
| macOS | Developer ID Application certificate; hardened runtime; `entitlements.plist`; notarisation via `notarytool`; staple the ticket | `codesign --verify --deep --strict`, `spctl -a -vv`, `xcrun stapler validate` |
| Linux | Optional GPG signing of packages and the AppImage; publish the public key | `gpg --verify` |

Rules:
- Secrets come from the CI secret store or the OS keychain. Never from a file in the repo.
- Always timestamp Windows signatures; an untimestamped signature expires with the cert.
- macOS: notarise the `.dmg`/`.zip` you actually distribute, then staple it.
- Do not disable Gatekeeper or instruct users to bypass SmartScreen as a "fix".

### 5. Produce the update feed

Generate the metadata your updater expects (`latest.yml` for electron-builder, or
`latest.json` for the Tauri updater) with: version, file URL, SHA-512 hash, and release
date. Publish the hash alongside the binary — the updater must reject a hash mismatch.

### 6. Verify the artefact, not the build

Install from the produced installer on a clean machine or VM:

1. Fresh install succeeds and the app launches.
2. Uninstall removes the app and leaves no orphaned service.
3. Upgrade from the previous version preserves user data and settings.
4. Signature is valid on a machine that has never seen the certificate.
5. Auto-update from N-1 to N succeeds and the version string updates.

## Rules

- Never commit certificates, keystores, passwords, or notarisation credentials.
- Never ship a build with devtools enabled in production, source maps, or a localhost API URL.
- Never silently change the app ID or publisher; it breaks upgrades and trust prompts.
- Report the SHA-256 of every artefact in the release notes.

## Output format

```
dist/<target>/<artefact>
dist/latest.yml | latest.json
RELEASE.md          # commands, signing identities used (names only), verification results
SHA256SUMS.txt
```

## Error handling

| Condition | Action |
|-----------|--------|
| No signing certificate available | Produce unsigned artefacts, label them "development only", and write the exact steps to obtain signing |
| Notarisation fails | Capture the `notarytool` log ID and the specific entitlement or binary at fault; do not retry blindly |
| Native module fails to load from asar | Add it to `asarUnpack` and rebuild |
| SmartScreen still warns after signing | Explain reputation warming; do not suggest disabling protections |

## Example

**Input:** Electron app, win-x64 + mac-arm64, GitHub Releases.
**Output:** NSIS installer and notarised DMG, `latest.yml` with SHA-512, `SHA256SUMS.txt`,
and `RELEASE.md` listing `signtool verify` and `spctl` results from a clean VM.
