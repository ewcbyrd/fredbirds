import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole } from '../hooks/useUserRole'
import { getMemberByEmail } from '../services/restdbService'
import imgScott from '../resources/photos/scott_byrd.jpg?url'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Grid,
  Avatar,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { 
  Person, 
  Email, 
  CalendarToday, 
  Verified, 
  LocationOn,
  Home,
  Nature,
  Public,
  Flag,
  Badge,
  AccountCircle,
  Link as LinkIcon,
  Phone,
  Facebook,
  Launch
} from '@mui/icons-material'
import RoleBadge from './RoleBadge'

const Profile = () => {
  const { user } = useAuth0()
  const { userRole } = useUserRole()
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('Fetching member data for:', user.email)
        
        let data = await getMemberByEmail(user.email)
        console.log('Member data received:', data)
        
        console.log('US Count:', data?.usCount)
        console.log('World Count:', data?.worldCount)
        setMemberData(data)
      } catch (err) {
        console.error('Error fetching member data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [user?.email])

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4">Profile not found</Typography>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading profile...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Profile data unavailable:</strong> {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Showing basic information from your login account.
          </Typography>
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar 
              src={memberData?.picture === 'imgScott' ? imgScott : 
                   memberData?.picture ? `/resources/photos/${memberData.picture}.jpg` : 
                   user.picture}
              alt={memberData?.first && memberData?.last ? `${memberData.first} ${memberData.last}` : user.name}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {memberData?.first && memberData?.last 
                  ? `${memberData.first} ${memberData.last}` 
                  : user.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  {memberData?.position || 'Member'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <RoleBadge showIcon={true} variant="filled" />
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Contact Information
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {memberData?.email || user.email}
                        {user.email_verified && (
                          <Chip 
                            size="small" 
                            icon={<Verified />} 
                            label="Verified" 
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                
                {memberData?.address && (
                  <ListItem>
                    <ListItemIcon>
                      <Home color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address"
                      secondary={memberData.address}
                    />
                  </ListItem>
                )}
                
                {memberData?.city && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="City"
                      secondary={`${memberData.city}${memberData.state ? `, ${memberData.state}` : ''}${memberData.zip ? ` ${memberData.zip}` : ''}`}
                    />
                  </ListItem>
                )}
                
                {memberData?.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone"
                      secondary={memberData.phone}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Membership Information
              </Typography>
              
              <List dense>
                {memberData?.memberSince && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Member Since"
                      secondary={new Date(memberData.memberSince).toLocaleDateString()}
                    />
                  </ListItem>
                )}
                
                {memberData?.yearJoined && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Member Since"
                      secondary={memberData.yearJoined}
                    />
                  </ListItem>
                )}
                
                {memberData?.status && (
                  <ListItem>
                    <ListItemIcon>
                      <Badge color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Status"
                      secondary={
                        <Chip 
                          size="small"
                          label={memberData.status}
                          color={memberData.status === 'active' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      }
                    />
                  </ListItem>
                )}
                
                {memberData?.nickname && (
                  <ListItem>
                    <ListItemIcon>
                      <AccountCircle color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Nickname"
                      secondary={memberData.nickname}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
          
          {/* Social Links */}
          {(memberData?.ebirdProfileUrl || memberData?.facebook) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom color="primary">
                Social Links
              </Typography>
              <Grid container spacing={2}>
                {memberData?.ebirdProfileUrl && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Nature color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            eBird Profile
                          </Typography>
                          <a 
                            href={memberData.ebirdProfileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1976d2', 
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '14px'
                            }}
                          >
                            View Profile
                            <Launch fontSize="small" />
                          </a>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                )}
                
                {memberData?.facebook && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Facebook color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Facebook
                          </Typography>
                          <a 
                            href={memberData.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1976d2', 
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '14px'
                            }}
                          >
                            View Profile
                            <Launch fontSize="small" />
                          </a>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </>
          )}
          
          {/* Birding Statistics */}
          {(memberData?.usCount || memberData?.worldCount) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom color="primary">
                Birding Activity
              </Typography>
              
              {(memberData?.usCount || memberData?.worldCount) && (
                <Grid container spacing={3}>
                  {memberData?.usCount && (
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                        <Flag color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" color="primary">
                          {memberData.usCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Species Sighted in US
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                  
                  {memberData?.worldCount && (
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                        <Public color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" color="secondary">
                          {memberData.worldCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Species Sighted Worldwide
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default Profile