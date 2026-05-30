import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Vitest reads this file instead of electron.vite.config.ts (which uses
// electron-vite's defineConfig and has no `test` field). We mirror the
// renderer `@renderer` alias so transformation imports resolve the same way
// they do in the app.
export default defineConfig({
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src')
    }
  },
  plugins: [vue()],
  test: {
    // html encode/decode rely on `document`, so the renderer unit tests run
    // against a DOM environment.
    environment: 'happy-dom',
    include: ['src/renderer/src/**/*.{test,spec}.ts'],
    globals: false
  }
})
