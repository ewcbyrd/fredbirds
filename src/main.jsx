import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './index.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
// Remove audience for basic login
// const audience = import.meta.env.VITE_AUTH0_AUDIENCE

// Debug logging
console.log('Auth0 Config:', { 
  domain, 
  clientId: clientId ? clientId.substring(0, 10) + '...' : 'undefined'
  // audience 
})

// Dynamically set redirect URI based on current origin
const redirectUri = window.location.origin
console.log('Redirect URI:', redirectUri)

// Determine cache location based on environment to prevent token sharing
// Use localStorage for both - browser automatically isolates by domain
// Localhost (127.0.0.1:5173) and production (www.fredbirds.com) have separate storage
const cacheLocation = 'localstorage'
console.log('Auth0 Cache Location:', cacheLocation, 'for domain:', window.location.hostname)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
      onRedirectCallback={(appState) => {
        console.log('Auth0 redirect callback:', appState)
        // Navigate to intended page or home
        window.location.href = appState?.returnTo || window.location.pathname
      }}
      onError={(error) => {
        console.error('Auth0 Error:', error)
        // Clear Auth0 state on error
        const authKeys = Object.keys(localStorage).filter(key => key.startsWith('auth0'))
        authKeys.forEach(key => localStorage.removeItem(key))
        sessionStorage.clear()
      }}
      cacheLocation={cacheLocation}
      useRefreshTokens={true}
      sessionCheckExpiryFraction={0.5}
    >
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
)
