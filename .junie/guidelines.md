# Project Guidelines for Textonom

## Project Overview
Textonom is a desktop text editor application built with Electron, React, and TypeScript. It provides a modern, feature-rich environment for editing text files with various transformation capabilities. The application allows users to open, edit, and save text files, with each file opened in a separate tab. It also provides a wide range of text transformation features, such as encoding/decoding, formatting, and conversion between different formats.

Key features include:
- Opening and saving text files
- Multi-tab interface for working with multiple files
- Various text transformations (Base64, JSON, XML, YAML, etc.)
- Customizable editor settings (themes, fonts, tab behavior, etc.)
- Auto-save functionality
- Special visual effects (CRT monitor effect in Cyberpunk Turbo theme)

## Project Structure
The project follows a standard Electron application structure:

```
textonom/
├── .junie/                  # Junie guidelines
├── build/                   # Build output
├── node_modules/            # Node.js dependencies
├── out/                     # Compiled output
├── resources/               # Application resources
├── src/                     # Source code
│   ├── main/                # Electron main process
│   ├── preload/             # Preload scripts
│   └── renderer/            # Renderer process (React application)
│       ├── src/
│           ├── assets/      # Static assets
│           ├── components/  # React components
│           ├── store/       # State management (zustand)
│           ├── styles/      # Styling (styled-components)
│           ├── utils/       # Utility functions
│           ├── App.tsx      # Main React component
│           └── main.tsx     # Entry point
├── .editorconfig            # Editor configuration
├── .eslintrc.js             # ESLint configuration
├── .prettierrc.yaml         # Prettier configuration
├── electron-builder.yml     # Electron builder configuration
├── electron.vite.config.ts  # Electron Vite configuration
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Key Components and Their Responsibilities

### Main Process (`src/main/`)
- `index.ts`: Entry point for the Electron main process. Sets up the application window and handles IPC communication for file operations.

### Preload Scripts (`src/preload/`)
- `index.ts`: Exposes a limited set of APIs from the main process to the renderer process.
- `index.d.ts`: TypeScript declarations for the exposed APIs.

### Renderer Process (`src/renderer/`)
- `App.tsx`: Main React component that sets up the application layout and manages the global state.
- `components/`:
  - `Editor.tsx`: Text editor component using Monaco Editor.
  - `MainMenu.tsx`: Main menu component with file operations and text transformations.
  - `SettingsDialog.tsx`: Settings dialog for customizing editor settings.
  - `TabBar.tsx`: Tab bar for navigating between open files.
- `store/`:
  - `useStore.ts`: State management using Zustand.
- `styles/`:
  - `themes.ts`: Theme definitions and global styles.
- `utils/`:
  - `textTransformations.ts`: Functions for various text transformations.

## Development Workflow

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Development
- The application uses Electron Vite for development and building.
- React components are in the `src/renderer/src/components/` directory.
- State management is handled by Zustand in `src/renderer/src/store/useStore.ts`.
- Styling is done with styled-components in `src/renderer/src/styles/themes.ts`.

### Building
- Run `npm run build` to build the application for the current platform.
- Platform-specific builds:
  - Windows: `npm run build:win`
  - macOS: `npm run build:mac`
  - Linux: `npm run build:linux`

## Testing
The project doesn't have automated tests yet. When implementing new features or fixing bugs, manually test the following:
1. File operations (open, save, save as)
2. Tab management (create, close, switch)
3. Text transformations (ensure they work correctly with various inputs)
4. Settings (ensure they are applied correctly and persisted)

## Code Style Guidelines
- The project uses ESLint and Prettier for code formatting.
- Run `npm run format` to format the code with Prettier.
- Run `npm run lint` to check for linting errors.
- Follow these general guidelines:
  - Use TypeScript for type safety.
  - Use functional components with hooks for React components.
  - Use styled-components for styling.
  - Use Zustand for state management.
  - Document complex functions and components.

## Junie Guidelines
When using Junie to work on this project:
1. Junie should understand the project structure and architecture as described above.
2. Junie should manually test any changes by running the application with `npm run dev`.
3. Junie should ensure that code follows the project's style guidelines.
4. Junie should build the project with `npm run build` before submitting changes to verify that the build process succeeds.
5. When implementing new features, Junie should follow the existing patterns and architecture.
