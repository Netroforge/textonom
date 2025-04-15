import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {TransformationProvider} from './contexts/TransformationContext'

createRoot(document.getElementById('root')).render(
  <TransformationProvider>
    <App />
  </TransformationProvider>
)
