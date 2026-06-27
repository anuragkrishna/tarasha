import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n'
import { applyTextScale, getTextScale } from './hooks/useTextScale'
import './App.css'

applyTextScale(getTextScale()) // restore the saved text size before first paint

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
)
