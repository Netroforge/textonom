# Textonom

A text editor that performs popular routine transformations of text on your local machine

## Features

- Open and edit text files in a tabbed interface
- Create new tabs for editing without saving to disk
- Save files to disk
- Apply various text transformations:
  - Base64 encoding/decoding
  - JSON prettify/compact
  - URL encoding/decoding
  - Case transformations (upper/lower/title)
  - XML formatting
  - Line operations (sort, deduplicate, reverse)
  - HTML encoding/decoding
  - Hash generation (MD5, SHA-1, SHA-256)
  - Unicode escaping/unescaping
  - JSON/YAML conversion
  - Spring Boot properties conversion
- Customize editor settings:
  - Theme selection (light, dark, cyberpunk, cyberpunk turbo)
  - Font customization
  - Tab behavior
  - Line numbers
  - Word wrap
  - Auto-save
- Special visual effects:
  - CRT monitor effect in Cyberpunk Turbo theme
  - Scanlines, screen flicker, glitch effects
  - Edge darkening and screen glow

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Rust (for Tauri)
- System libraries for Tauri (see [DEPENDENCIES.md](DEPENDENCIES.md) for details)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/textonom.git
cd textonom

# Install dependencies
npm install
```

### Running the Application

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Package the application
npm run tauri build
```

> **Note:** Building the application requires system libraries. See [DEPENDENCIES.md](DEPENDENCIES.md) for installation instructions if you encounter build errors.

### Keyboard Shortcuts

The application supports standard keyboard shortcuts:

- Ctrl+N / Cmd+N: New file
- Ctrl+O / Cmd+O: Open file
- Ctrl+S / Cmd+S: Save file
- Ctrl+Shift+S / Cmd+Shift+S: Save file as
- Ctrl+W / Cmd+W: Close current tab
- Ctrl+Tab / Cmd+Tab: Cycle through tabs
- Ctrl+, / Cmd+,: Open settings

## Technologies

- Tauri 2.0
- React
- Monaco Editor
- Zustand (for state management)

## License

MIT
