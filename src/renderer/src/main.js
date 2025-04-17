import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { applyTheme } from './styles/themes'
import { useSettingsStore } from './store/settingsStore'

// Create the app
const app = createApp(App)

// Create and use Pinia
const pinia = createPinia()
app.use(pinia)

// Mount the app
app.mount('#app')

// Apply the theme from settings
const settingsStore = useSettingsStore()
applyTheme(settingsStore.theme)
