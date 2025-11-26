import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Avatar,
  Chip
} from '@mui/material'

const MemberDashboard = () => {
  const { user } = useAuth0()

  return (
    <Box sx={{ bgcolor: '#f7faf7', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Member Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Welcome to your member area, {user?.given_name || user?.name}!
          </Typography>
        </Box>

        {/* Member Info Card */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    src={user?.picture} 
                    alt={user?.name}
                    sx={{ width: 80, height: 80, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {user?.email}
                    </Typography>
                    <Chip 
                      label="Active Member" 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Member Information
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gap: 1,
                  '& > div': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 0.5
                  }
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Verified:
                    </Typography>
                    <Chip 
                      label={user?.email_verified ? "Yes" : "No"} 
                      color={user?.email_verified ? "success" : "warning"}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Login:
                    </Typography>
                    <Typography variant="body2">
                      {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Links
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Upcoming Events
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and register for club events
                    </Typography>
                  </Card>
                  
                  <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      My Trip History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View events you've attended
                    </Typography>
                  </Card>
                  
                  <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Update Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your account settings
                    </Typography>
                  </Card>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default MemberDashboard