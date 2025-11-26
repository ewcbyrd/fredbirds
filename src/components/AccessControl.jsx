import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { Lock } from '@mui/icons-material'

const AccessControl = ({ 
  children, 
  requiredLevel = ACCESS_LEVELS.PUBLIC,
  fallback = null,
  showMessage = true,
  customMessage = null 
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0()
  const { hasAccess, roleLoading } = useUserRole()

  // Show loading while checking authentication and roles
  if (authLoading || roleLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Checking access...
        </Typography>
      </Box>
    )
  }

  // Check if user has required access level
  if (hasAccess(requiredLevel)) {
    return <>{children}</>
  }

  // Return custom fallback if provided
  if (fallback) {
    return fallback
  }

  // Don't show anything if showMessage is false
  if (!showMessage) {
    return null
  }

  // Default access denied message
  const defaultMessage = requiredLevel === ACCESS_LEVELS.MEMBER && !isAuthenticated
    ? "Please log in to access this content."
    : `This content requires ${requiredLevel} access.`

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={4}
      sx={{ 
        minHeight: 200,
        backgroundColor: 'grey.50',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Lock sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
      <Alert severity="warning" sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Access Restricted
        </Typography>
        <Typography variant="body2">
          {customMessage || defaultMessage}
        </Typography>
      </Alert>
    </Box>
  )
}

export default AccessControl