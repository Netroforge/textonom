# **Project Requirements Document: Textonom**

This document outlines the current implementation and features of the Textonom application.

## Core Functionality

| Requirement ID | Description                           | Implementation Status                                                                                                                            |
|----------------|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| CF001          | Home page with transformation catalog | Implemented. The application features a home page that displays all available transformations organized by categories with search functionality. |
| CF002          | Dedicated transformation pages        | Implemented. Each transformation has its own dedicated page with input/output forms and action buttons.                                          |
| CF003          | Tab-based navigation                  | Implemented. Transformations are opened in tabs that can be navigated between. Tabs are draggable to reorder them.                               |
| CF004          | Tab state persistence                 | Implemented. The application saves the state of open tabs (which tabs are open, not their content) between application restarts.                 |
| CF005          | Home button navigation                | Implemented. Users can navigate to the home page without closing tabs and return to open tabs afterward.                                         |

## Text Transformations

| Requirement ID | Category            | Transformation                          | Description                                          | Implementation Status                                 |
|----------------|---------------------|-----------------------------------------|------------------------------------------------------|-------------------------------------------------------|
| TT001          | Encoding & Decoding | Base64 Encode/Decode                    | Convert text to/from Base64 format                   | Implemented                                           |
| TT002          | Encoding & Decoding | URL Encode/Decode                       | Convert text to/from URL-encoded format              | Implemented                                           |
| TT003          | Encoding & Decoding | HTML Encode/Decode                      | Convert special characters to/from HTML entities     | Implemented                                           |
| TT004          | Encoding & Decoding | Unicode Escape/Unescape                 | Convert text to/from Unicode escaped format (\uXXXX) | Implemented                                           |
| TT005          | Formatting          | JSON Prettify/Compact                   | Format JSON with proper indentation or compact it    | Implemented                                           |
| TT006          | Formatting          | XML Prettify/Compact                    | Format XML with proper indentation or compact it     | Implemented                                           |
| TT007          | Case Conversion     | Uppercase/Lowercase/Title Case          | Convert text case                                    | Implemented                                           |
| TT008          | Text Operations     | Sort/Deduplicate/Reverse Lines          | Manipulate text lines                                | Implemented                                           |
| TT009          | Hashing             | MD5/SHA-1/SHA-256/Bcrypt                | Generate cryptographic hashes                        | Implemented. Bcrypt allows configurable rounds (1-20) |
| TT010          | Conversion          | JSON to YAML / YAML to JSON             | Convert between JSON and YAML formats                | Implemented                                           |
| TT011          | Conversion          | Properties to YAML / YAML to Properties | Convert between Java properties and YAML formats     | Implemented                                           |

## UI and Settings

| Requirement ID | Description              | Implementation Status                                                                        |
|----------------|--------------------------|----------------------------------------------------------------------------------------------|
| UI001          | Theme selection          | Implemented. The application provides Light, Dark, and Cyberpunk themes.                     |
| UI002          | Turbo Mode (CRT effects) | Implemented. Users can enable/disable CRT effects for any theme.                             |
| UI003          | Font customization       | Implemented. Users can select font family and size.                                          |
| UI004          | Settings persistence     | Implemented. Settings are saved to localStorage and persist between sessions.                |
| UI005          | Status bar               | Implemented. Displays current theme and other status information.                            |
| UI006          | Title bar                | Implemented. Custom title bar with window controls.                                          |
| UI007          | Top navigation bar       | Implemented. Contains About menu with access to application information and update checking. |

## File Operations

| Requirement ID | Description             | Implementation Status                                                                                                                             |
|----------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| FO001          | Open file               | Implemented. Users can open text files from their local disk.                                                                                     |
| FO002          | Save file               | Implemented. Users can save the current content to disk.                                                                                          |
| FO003          | Save file as            | Implemented. Users can save the current content to a new location.                                                                                |
| FO004          | File dialog defaults    | Implemented. File dialogs show all files with all extensions by default.                                                                          |
| FO005          | File extension handling | Implemented. When saving files, the app selects the extension of the file that was opened, and uses 'txt' as the default extension for new files. |
| FO006          | Last directory memory   | Implemented. The application remembers the last directory used for file operations.                                                               |

## Visual Effects

| Requirement ID | Description              | Implementation Status                                                                              |
|----------------|--------------------------|----------------------------------------------------------------------------------------------------|
| VE001          | CRT monitor effect       | Implemented. The application includes a comprehensive CRT effect when Turbo Mode is enabled.       |
| VE002          | Scanlines                | Implemented. Horizontal scanlines with appropriate spacing and intensity.                          |
| VE003          | Screen flicker           | Implemented. Subtle screen flicker effect that simulates CRT monitor behavior.                     |
| VE004          | Glitch effects           | Implemented. Occasional glitch effects including horizontal lines, color shifts, and static noise. |
| VE005          | Edge darkening           | Implemented. Edge darkening without circular screen curvature.                                     |
| VE006          | Screen glow              | Implemented. Subtle glow effect to enhance the cyberpunk aesthetic.                                |
| VE007          | Transformation animation | Implemented. Transformations are applied asynchronously with animation during processing.          |

## Auto-Update Functionality

| Requirement ID | Description          | Implementation Status                                                         |
|----------------|----------------------|-------------------------------------------------------------------------------|
| AU001          | Check for updates    | Implemented. The application can check for updates manually or automatically. |
| AU002          | Download updates     | Implemented. Updates can be downloaded with progress indication.              |
| AU003          | Install updates      | Implemented. Downloaded updates can be installed.                             |
| AU004          | Update notifications | Implemented. Non-transparent notifications about available updates.           |
| AU005          | Update settings      | Implemented. Users can configure auto-update behavior and startup checks.     |

## State Persistence

| Requirement ID | Description           | Implementation Status                                                                                                   |
|----------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------|
| SP001          | Settings persistence  | Implemented. User settings are saved to localStorage.                                                                   |
| SP002          | Tab state persistence | Implemented. Open tabs are saved to disk and restored on application restart.                                           |
| SP003          | Home page state       | Implemented. The state of the home page (scroll position, search query, etc.) is preserved when switching between tabs. |

## About Section

| Requirement ID | Description       | Implementation Status                                                  |
|----------------|-------------------|------------------------------------------------------------------------|
| AB001          | About dialog      | Implemented. Shows application information, version, and logo.         |
| AB002          | Version display   | Implemented. Shows the current application version.                    |
| AB003          | Check for updates | Implemented. Users can manually check for updates from the About menu. |

## Tech Stack

- **Frontend**: TypeScript, Vue 3, Pinia (state management)
- **Desktop Framework**: Electron, electron-vite
- **Build Tools**: Node.js v23.11.0
- **Libraries**: crypto-js, bcryptjs, js-yaml, js-base64, xml-formatter, electron-updater
