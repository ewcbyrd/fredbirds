import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material'
import UserProfile from './UserProfile'

const ProtectedRoute = ({ children, title = "Members Only" }) => {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ bgcolor: '#f7faf7', minHeight: '100vh', py: 6 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto', px: 2 }}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Please log in with your member account to access this content.
              </Typography>
              <UserProfile />
            </CardContent>
          </Card>
        </Box>
      </Box>
    )
  }

  return children
}

export default ProtectedRoute