import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n'
import { applyTextScale, getTextScale } from './hooks/useTextScale'
import './App.css'

// Restore the saved text size before first paint — but only inside the app;
// the landing page is always shown at standard size.
applyTextScale(window.location.pathname.startsWith('/app') ? getTextScale() : 'A')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
)
