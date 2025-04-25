import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Create the root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// Create the React root
const root = ReactDOM.createRoot(rootElement)

// Determine if we should use StrictMode
// For consistent behavior between dev and prod, we're disabling StrictMode
const useStrictMode = true // Set to true if you want StrictMode in development

// Render the app
if (useStrictMode) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  root.render(<App />)
}
