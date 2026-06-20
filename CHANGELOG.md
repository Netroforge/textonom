# Changelog

All notable changes to this project will be documented in this file.

## [1.4.9] - 2026-06-20

### Improvements

- **Donation infrastructure**: Added "Support the Project" section to About dialog and README with links to GitHub Sponsors, Ko-fi, Open Collective, and Patreon. Added GitHub Sponsors to FUNDING.yml.
- **Error handling**: Replaced all `console.error` calls in transformation functions and page components with visible user feedback via toast notifications. Errors are now shown both in the output text area and as toast alerts.
- **Dead code removal**: Removed legacy `save-app-state`/`load-app-state` IPC handlers, preload APIs, and type definitions that were superseded by the per-key persistence system. Removed empty `saveStateBeforeUnload` handler in App.vue.

### Fixes

- **License consistency**: All references now correctly say "Apache License 2.0" to match the LICENSE file.
- **Badge spelling**: Fixed "vibe_debuged" → "vibe_debugged" in README.
- **CHANGELOG accuracy**: Corrected v1.1.0 changelog entry that incorrectly claimed "Migration to React 19" (the app uses Vue 3).
- **AppUserModelId**: Changed from generic `com.electron` to `com.github.netroforge`.
- **Zustand reference**: Removed stale Zustand comment in themes.ts.

### Chores

- Added Dependabot configuration for npm and GitHub Actions dependency updates.
- Stripped redundant `console.error` calls from 43 transformation functions and 24 page components.

## [1.3.0] - 2026-05-02

### Features

- **New Transformations**:
  - UUID Generator (v4, with count and uppercase options)
  - Lorem Ipsum generator (paragraphs, sentences, or words)
  - Slugify (URL-friendly slug)
  - Unix Timestamp ↔ ISO 8601 (both directions)
  - Color Converter (hex / rgb() / hsl())
  - Number Base Converter (binary / octal / decimal / hex)
  - New "Generators" category on the home page
- **PBKDF2 Hash**: Replaces the previous Argon2 transformation, which was a PBKDF2 simulation in disguise. PBKDF2 is now exposed honestly with configurable HMAC algorithm (SHA-1/256/512), iterations, key length, and salt.
- **Global keyboard shortcuts**: Ctrl/Cmd+W closes the active tab, Ctrl/Cmd+H jumps to the home page (alongside the existing Ctrl+K, Ctrl+Tab, and Ctrl+1–9 shortcuts).

### Improvements

- **Hashing off the main thread**: bcrypt and PBKDF2 now run in a Web Worker, so the UI no longer freezes on high cost factors or iteration counts.
- **Update error UX**: Update errors now show a dedicated notification with **Retry** and **Copy details** buttons instead of a generic browser alert.
- **Accessibility**: Tab bar tabs are now exposed as a proper `tablist` with keyboard activation; tab context menu items are keyboard-navigable; home page categories are wrapped in semantic `<section>` elements with `aria-labelledby`.

### Changes

- **Removed**: Argon2 transformation (replaced by PBKDF2).
- **Build**: Removed the unused legacy `.eslintrc.cjs` config; ESLint now uses only the flat `eslint.config.mjs`.

## [1.1.0] - 2025-04-23

### Features

- **New Transformations**: Added several new text transformations:
  - JWT Decode
  - SHA-512 Hash
  - HMAC Generation
  - Markdown to HTML
  - CSV to JSON and JSON to CSV conversion
  - SQL Formatter
  - HTML/CSS/JS Formatter
  - Text Case Converter
  - Remove Empty Lines
  - Remove Duplicate Words
  - Hex Encode/Decode

### Improvements

- **Word Wrap**: Added option to enable/disable word wrap for all text areas
- **Status Bar**: Improved status bar to display the current open tab name
- **Tab Behavior**: Adjusted tab behavior to switch to another open tab when closing a tab
- **CRT Effects**: Optimized CRT effects for better performance
- **Styling**: Fixed various styling issues throughout the application

### Changes

- **Removed Features**:
  - Removed localization support to simplify the codebase
  - Removed saving of content tabs between application restarts

### Other Changes

- **Website**: Updated the project website with new information
- **Funding**: Added GitHub funding configuration
- **Dependencies**: Updated several dependencies to their latest versions:
  - @typescript-eslint/eslint-plugin from 8.30.1 to 8.31.0
  - @typescript-eslint/parser from 8.30.1 to 8.31.0
  - eslint from 9.25.0 to 9.25.1

## [1.0.2] - 2025-04-22

For changes in version 1.0.2, please see the [GitHub release page](https://github.com/Netroforge/textonom/releases/tag/v1.0.2).
