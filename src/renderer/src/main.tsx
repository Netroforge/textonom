import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/global.css'

// Create the root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// Create the React root
const root = ReactDOM.createRoot(rootElement)

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
