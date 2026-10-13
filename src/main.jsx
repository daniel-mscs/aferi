import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { Toaster } from 'sonner'

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__installPrompt = e
  window.dispatchEvent(new Event('installprompt-ready'))
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster theme="dark" position="top-center" richColors />
    </AuthProvider>
  </StrictMode>,
)
