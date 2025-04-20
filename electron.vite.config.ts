import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    worker: {
      format: 'es'
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            jsonWorker: ['monaco-editor/esm/vs/language/json/json.worker'],
            cssWorker: ['monaco-editor/esm/vs/language/css/css.worker'],
            htmlWorker: ['monaco-editor/esm/vs/language/html/html.worker'],
            tsWorker: ['monaco-editor/esm/vs/language/typescript/ts.worker'],
            editorWorker: ['monaco-editor/esm/vs/editor/editor.worker']
          }
        }
      }
    }
  }
})
