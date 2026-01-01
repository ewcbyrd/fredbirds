import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
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

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate()

  const onRedirectCallback = (appState) => {
    console.log('Auth0 redirect callback:', appState)
    // Use navigate instead of window.location.href to preserve memory state
    navigate(appState?.returnTo || window.location.pathname)
  }

  const onError = (error) => {
    console.error('Auth0 Error:', error)
    // Clear Auth0 state on error
    const authKeys = Object.keys(localStorage).filter(key => key.startsWith('auth0'))
    authKeys.forEach(key => localStorage.removeItem(key))
    sessionStorage.clear()
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
      onError={onError}
      // cacheLocation="localstorage" - Removed to prevent permanent login
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
)
