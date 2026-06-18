import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { DossierProvider } from './state/DossierContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DossierProvider>
      <App />
    </DossierProvider>
  </React.StrictMode>,
)
