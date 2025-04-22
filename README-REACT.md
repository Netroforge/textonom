# Textonom React Migration

This document outlines the migration of Textonom from Vue to React.

## Overview

Textonom has been migrated from Vue 3 with Pinia to React with Context API. The application maintains the same functionality and UI design, but with a React-based implementation.

## Key Changes

### State Management

- Replaced Pinia stores with React Context API
- Created context providers for:
  - Settings
  - Tabs
  - Tab Content
  - Home Page

### Component Structure

- Migrated Vue Single File Components to React functional components
- Implemented hooks for state management
- Created a base transformation page component to reduce code duplication

### UI Components

- Implemented custom UI components:
  - TitleBar
  - TopNavBar
  - TabBar with drag-and-drop functionality
  - StatusBar
  - CRTEffect
  - Transformation pages

### Styling

- Maintained the same styling approach with CSS files
- Preserved theme system with light, dark, and cyberpunk themes

## Project Structure

```
src/
├── main/                  # Electron main process
├── preload/               # Preload scripts for IPC
└── renderer/
    └── src/
        ├── assets/        # Static assets
        ├── components/    # React components
        │   ├── transformations/  # Transformation pages
        │   └── ...
        ├── contexts/      # React contexts for state management
        ├── services/      # Application services
        ├── styles/        # Global styles and themes
        ├── transformations/  # Transformation functions
        ├── types/         # TypeScript type definitions
        ├── App.tsx        # Main App component
        └── main.tsx       # React entry point
```

## Running the Application

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Build for specific platforms
npm run build:win
npm run build:mac
npm run build:linux
```

## Development Notes

### Adding New Transformations

1. Create a transformation function in the appropriate category folder
2. Register the transformation in `src/renderer/src/transformations/registry.ts`
3. Create a transformation page component in `src/renderer/src/components/transformations/`
4. Register the component in `src/renderer/src/components/transformations/index.ts`

### Theme System

The theme system is implemented in `src/renderer/src/styles/themes.ts`. To modify or add themes:

1. Update the theme definitions in `themes.ts`
2. Apply the theme using the `applyTheme` function

### IPC Communication

IPC communication is handled through the preload script. The API is defined in `src/renderer/src/preload.d.ts` and implemented in `src/preload/index.ts`.

## Testing

Tests can be run using:

```bash
npm test
```

## Known Issues

- None at this time

## Future Improvements

- Add more transformations
- Implement keyboard shortcuts
- Add language detection
- Improve accessibility
