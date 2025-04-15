import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import fs from 'fs-extra'
import path from 'path'

function copyMonacoEditorFiles() {
  return {
    name: 'copy-monaco-editor',
    writeBundle: async () => {
      const monacoSource = 'node_modules/monaco-editor/min/vs'
      const monacoDestination = 'dist/vs'
      try {
        await fs.ensureDir(path.dirname(monacoDestination))
        await fs.copy(monacoSource, monacoDestination)
        console.log('Monaco editor files copied successfully')
      } catch (error) {
        console.error('Failed to copy Monaco editor files:', error)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'main.js',
    }),
    copyMonacoEditorFiles()
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/monaco-editor')) {
            return 'monaco'
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react'
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
  }
})
