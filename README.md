# Textonom

A text editor application that performs popular routine transformations of text on your local machine.

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

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

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
npm run electron:dev

# Build for production
npm run electron:build

# Package for specific platforms
npm run electron:package:win    # Windows
npm run electron:package:mac    # macOS
npm run electron:package:linux  # Linux
```

### Debugging

This project includes VS Code debugging configurations. To debug the application:

1. Open the project in VS Code
2. Go to the Run and Debug view
3. Select "Main + renderer" from the dropdown
4. Press F5 to start debugging

## Technologies

- Electron
- React
- Monaco Editor
- Styled Components

## License

MIT
