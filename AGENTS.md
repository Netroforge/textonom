# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview
Textonom is an Electron + React + TypeScript desktop app for local text transformations. It uses `electron-vite` for main/preload/renderer builds and `electron-builder` for packaging and release publishing.

## Canonical development commands
Run from repository root.

- Install dependencies:
  - `npm install`
- Start app in development (Electron + Vite HMR):
  - `npm run dev`
- Start built app in preview mode:
  - `npm run start`
- Type-check:
  - `npm run type-check`
- Lint:
  - `npm run lint`
- Auto-fix lint issues:
  - `npm run lint:fix`
- Format:
  - `npm run format`
- Build app bundles (without packaging):
  - `npm run build`
- Build distributables:
  - Linux: `npm run build:linux`
  - macOS: `npm run build:mac`
  - Windows: `npm run build:win`
- Build unpacked app:
  - `npm run build:unpack`

## Testing status
There is currently no test runner configured in `package.json` (no `test` script, and no Jest/Vitest/Playwright config in the repo).

- “Single test” command: not available yet.
- For targeted validation of a change, use file-scoped lint/type-check patterns such as:
  - `npx eslint src/renderer/src/components/YourFile.tsx`
  - `npx tsc --noEmit -p tsconfig.json`

## Architecture map (big picture)
### Process boundaries
- `src/main/index.ts`: Electron main process.
  - Creates frameless `BrowserWindow`, restores window position/size, manages update events, and owns IPC handlers.
  - Persists state files under Electron `userData/state`.
- `src/preload/index.ts`: secure bridge (`window.api`) exposing IPC-backed methods to renderer (window controls, state persistence, updater).
- `src/renderer/src/*`: React app UI and transformation engine.

### State and persistence model
- Active app state is in Zustand stores under `src/renderer/src/stores/`.
  - Persisted stores: `settingsStore`, `tabsStore`, `homePageStore`, `windowStore`.
  - Non-persisted in-memory store: `tabsContentStore` (tab input/output/params while app runs).
- Legacy context/service code still exists under `src/renderer/src/contexts/*` and `src/renderer/src/services/{stateService,persistenceService}.ts`, but current app flow uses Zustand stores.
- Persistence path:
  - Store `persist` middleware -> `createElectronStorage` (`stores/electronStorage.ts`) -> `window.api.saveState/loadState` -> IPC handlers in `src/main/index.ts` -> JSON files in `userData/state/{key}.json`.
- Main process separately tracks window geometry/fullscreen/maximized state and pushes updates back to renderer via `window-state-updated`.

### Transformation system wiring
- Pure transformation functions live in `src/renderer/src/transformations/**` (grouped by domain: `base64`, `json`, `hash`, `conversion`, etc.).
- Metadata and discoverability are centralized in `src/renderer/src/transformations/registry.ts` (IDs, categories, descriptions, parameter metadata, search).
- UI pages are mapped in `src/renderer/src/components/transformations/index.ts` (transformation ID -> page component).
- Most page components are thin wrappers around `BaseTransformationPage`, which handles input/output UX and per-tab content persistence.

When adding a transformation, the minimum cross-file path is:
1) implement function in `transformations/**`,
2) export it through `transformations/index.ts`,
3) add metadata in `transformations/registry.ts`,
4) add UI page + ID mapping in `components/transformations/index.ts`.

### UI composition flow
- `App.tsx` composes shell UI (title bar, top nav, tabs, status bar, dialogs).
- `HomePage.tsx` reads categories from registry, supports search, and opens transformations as tabs.
- Tabs store controls which transformation page renders; active tab’s `transformationId` selects component via `getTransformationPageComponent`.
