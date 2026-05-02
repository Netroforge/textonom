import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/index.css'

const rootElement = document.getElementById('app')

if (!rootElement) {
  throw new Error('Root element not found')
}

const app = createApp(App)
app.use(createPinia())
app.mount(rootElement)
