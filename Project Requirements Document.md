# **Project Requirements Document: Textonom**

This document outlines the current implementation and features of the Textonom application.

## Core Functionality

| Requirement ID | Description                              | Implementation Status                  |
| -------------- | ---------------------------------------- | -------------------------------------- |
| CORE-01        | Cross-platform desktop application       | Implemented using Electron             |
| CORE-02        | Modern UI with React                     | Implemented with React 19              |
| CORE-03        | Type-safe codebase                       | Implemented with TypeScript            |
| CORE-04        | Multiple themes                          | Implemented (Light, Dark, Cyberpunk)   |
| CORE-05        | Tab-based interface                      | Implemented with drag-and-drop support |
| CORE-06        | Home page with transformation categories | Implemented with search functionality  |
| CORE-07        | Status bar                               | Implemented                            |
| CORE-08        | Title bar with window controls           | Implemented                            |

## Text Transformations

| Requirement ID | Category          | Transformation         | Description                                        | Implementation Status |
| -------------- | ----------------- | ---------------------- | -------------------------------------------------- | --------------------- |
| TRANS-01       | Encoding          | Base64 Encode          | Encode text to Base64 format                       | Implemented           |
| TRANS-02       | Encoding          | Base64 Decode          | Decode Base64 encoded text                         | Implemented           |
| TRANS-03       | Encoding          | URL Encode             | Encode text for use in URLs                        | Implemented           |
| TRANS-04       | Encoding          | URL Decode             | Decode URL encoded text                            | Implemented           |
| TRANS-05       | Encoding          | HTML Encode            | Encode special characters for HTML                 | Implemented           |
| TRANS-06       | Encoding          | HTML Decode            | Decode HTML entities to characters                 | Implemented           |
| TRANS-07       | Encoding          | Unicode Escape         | Escape Unicode characters to \uXXXX format         | Implemented           |
| TRANS-08       | Encoding          | Unicode Unescape       | Convert \uXXXX format to actual Unicode characters | Implemented           |
| TRANS-09       | Encoding          | Hex Encode             | Convert text to hexadecimal representation         | Implemented           |
| TRANS-10       | Encoding          | Hex Decode             | Convert hexadecimal back to text                   | Implemented           |
| TRANS-11       | Formatting        | JSON Prettify          | Format JSON with proper indentation                | Implemented           |
| TRANS-12       | Formatting        | JSON Compact           | Compact JSON by removing whitespace                | Implemented           |
| TRANS-13       | Formatting        | XML Prettify           | Format XML with proper indentation                 | Implemented           |
| TRANS-14       | Formatting        | XML Compact            | Compact XML by removing whitespace                 | Implemented           |
| TRANS-15       | Formatting        | SQL Format             | Format SQL queries with proper indentation         | Implemented           |
| TRANS-16       | Formatting        | HTML Format            | Format HTML with proper indentation                | Implemented           |
| TRANS-17       | Formatting        | CSS Format             | Format CSS with proper indentation                 | Implemented           |
| TRANS-18       | Formatting        | JS Format              | Format JavaScript with proper indentation          | Implemented           |
| TRANS-19       | Formatting        | XML Format             | Format XML with proper indentation                 | Implemented           |
| TRANS-20       | Case Conversion   | To Uppercase           | Convert text to uppercase                          | Implemented           |
| TRANS-21       | Case Conversion   | To Lowercase           | Convert text to lowercase                          | Implemented           |
| TRANS-22       | Case Conversion   | To Title Case          | Convert text to title case                         | Implemented           |
| TRANS-23       | Case Conversion   | To Snake Case          | Convert text to snake_case                         | Implemented           |
| TRANS-24       | Case Conversion   | To Camel Case          | Convert text to camelCase                          | Implemented           |
| TRANS-25       | Case Conversion   | To Kebab Case          | Convert text to kebab-case                         | Implemented           |
| TRANS-26       | Text Operations   | Sort Lines             | Sort lines alphabetically                          | Implemented           |
| TRANS-27       | Text Operations   | Deduplicate Lines      | Remove duplicate lines                             | Implemented           |
| TRANS-28       | Text Operations   | Reverse Lines          | Reverse the order of lines                         | Implemented           |
| TRANS-29       | Text Operations   | Remove Empty Lines     | Remove all empty lines from text                   | Implemented           |
| TRANS-30       | Text Operations   | Remove Duplicate Words | Remove duplicate words from text                   | Implemented           |
| TRANS-31       | Hashing           | MD5 Hash               | Generate MD5 hash of text                          | Implemented           |
| TRANS-32       | Hashing           | SHA-1 Hash             | Generate SHA-1 hash of text                        | Implemented           |
| TRANS-33       | Hashing           | SHA-256 Hash           | Generate SHA-256 hash of text                      | Implemented           |
| TRANS-34       | Hashing           | SHA-512 Hash           | Generate SHA-512 hash of text                      | Implemented           |
| TRANS-35       | Hashing           | HMAC Hash              | Generate HMAC hash with custom key                 | Implemented           |
| TRANS-36       | Hashing           | Bcrypt Hash            | Generate Bcrypt hash with configurable rounds      | Implemented           |
| TRANS-37       | Hashing           | Argon2 Hash            | Generate Argon2 hash                               | Implemented           |
| TRANS-38       | Format Conversion | JSON to YAML           | Convert JSON to YAML format                        | Implemented           |
| TRANS-39       | Format Conversion | YAML to JSON           | Convert YAML to JSON format                        | Implemented           |
| TRANS-40       | Format Conversion | Properties to YAML     | Convert Java properties file to YAML               | Implemented           |
| TRANS-41       | Format Conversion | YAML to Properties     | Convert YAML to Java properties file format        | Implemented           |
| TRANS-42       | Format Conversion | CSV to JSON            | Convert CSV to JSON format                         | Implemented           |
| TRANS-43       | Format Conversion | JSON to CSV            | Convert JSON to CSV format                         | Implemented           |
| TRANS-44       | Decoding          | JWT Decode             | Decode and display JWT token contents              | Implemented           |
| TRANS-45       | Conversion        | Markdown to HTML       | Convert Markdown to HTML                           | Implemented           |

## UI and Settings

| Requirement ID | Description                                      | Implementation Status |
| -------------- | ------------------------------------------------ | --------------------- |
| UI-01          | Responsive layout                                | Implemented           |
| UI-02          | Theme selection (Light, Dark, Cyberpunk)         | Implemented           |
| UI-03          | Font size adjustment                             | Implemented           |
| UI-04          | Font family selection                            | Implemented           |
| UI-05          | Word wrap toggle                                 | Implemented           |
| UI-06          | Tab-based interface                              | Implemented           |
| UI-07          | Draggable tabs                                   | Implemented           |
| UI-08          | Tab context menu (close, close others, etc.)     | Implemented           |
| UI-09          | Home button that remains highlighted when active | Implemented           |
| UI-10          | Transformation search on home page               | Implemented           |
| UI-11          | Transformation categories on home page           | Implemented           |
| UI-12          | Settings dialog with tabbed sections             | Implemented           |
| UI-13          | Status bar showing current state                 | Implemented           |
| UI-14          | Keyboard shortcuts for tab navigation            | Implemented           |
| UI-15          | Transformation parameters UI                     | Implemented           |
| UI-16          | Transformation animation during processing       | Implemented           |

## Visual Effects

| Requirement ID | Description                           | Implementation Status                      |
| -------------- | ------------------------------------- | ------------------------------------------ |
| VFX-01         | CRT effect (Turbo Mode)               | Implemented with performance optimizations |
| VFX-02         | Scanlines effect                      | Implemented                                |
| VFX-03         | Screen flicker effect                 | Implemented                                |
| VFX-04         | RGB separation effect                 | Implemented                                |
| VFX-05         | Vignette effect                       | Implemented                                |
| VFX-06         | Glitch effects                        | Implemented                                |
| VFX-07         | Toggle for enabling/disabling effects | Implemented in settings                    |

## Auto-Update Functionality

| Requirement ID | Description                                | Implementation Status               |
| -------------- | ------------------------------------------ | ----------------------------------- |
| UPDATE-01      | Check for updates automatically            | Implemented using electron-updater  |
| UPDATE-02      | Manual update check                        | Implemented                         |
| UPDATE-03      | Update notification                        | Implemented with non-transparent UI |
| UPDATE-04      | Update download with progress indicator    | Implemented                         |
| UPDATE-05      | Update installation                        | Implemented                         |
| UPDATE-06      | Toggle for enabling/disabling auto-updates | Implemented in settings             |
| UPDATE-07      | Toggle for checking updates on startup     | Implemented in settings             |

## State Persistence

| Requirement ID | Description                                    | Implementation Status                                |
| -------------- | ---------------------------------------------- | ---------------------------------------------------- |
| STATE-01       | Save application settings                      | Implemented using Zustand with persist middleware    |
| STATE-02       | Save tab structure between sessions            | Implemented using Electron IPC and app state file    |
| STATE-03       | Save home page state (search, scroll position) | Implemented                                          |
| STATE-04       | Do not save tab content between sessions       | Implemented (content is intentionally not persisted) |
| STATE-05       | Remember active tab and home page visibility   | Implemented                                          |

## About Section

| Requirement ID | Description                 | Implementation Status |
| -------------- | --------------------------- | --------------------- |
| ABOUT-01       | Application version display | Implemented           |
| ABOUT-02       | Application information     | Implemented           |
| ABOUT-03       | Links to GitHub repository  | Implemented           |

## Tech Stack

| Technology | Purpose                          |
| ---------- | -------------------------------- |
| Electron   | Cross-platform desktop framework |
| React      | UI library                       |
| TypeScript | Type-safe JavaScript             |
| Zustand    | State management                 |
