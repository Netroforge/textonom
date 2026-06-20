# Changelog

All notable changes to this project will be documented in this file.

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

- **Framework Update**: Migrated the application to use Vue 3 Composition API for better performance and maintainability
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
