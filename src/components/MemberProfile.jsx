import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
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
  ListItemText,
  Button,
  IconButton
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
  Phone,
  Facebook,
  Launch,
  ArrowBack,
  EmojiEvents,
  Star,
  Diamond,
  Whatshot,
  WorkspacePremium
} from '@mui/icons-material'
import { getMemberByEmail } from '../services/restdbService'
import imgScott from '../resources/photos/scott_byrd.jpg?url'

const MemberProfile = () => {
  const { email } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth0()
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!email) {
        setError('No member email provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const decodedEmail = decodeURIComponent(email)
        console.log('Fetching member data for:', decodedEmail)
        
        let data = await getMemberByEmail(decodedEmail)
        console.log('Member data received:', data)
        
        if (data) {
          setMemberData(data)
        } else {
          setError('Member not found')
        }
      } catch (err) {
        console.error('Error fetching member data:', err)
        setError('Unable to load member profile')
      } finally {
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [email])

  const isOwnProfile = () => {
    if (!user || !memberData) return false
    return user.email === memberData.email
  }

  const formatName = (member) => {
    if (!member) return 'Unknown Member'
    
    // Try different field name conventions
    if (member.Name) {
      return member.Name  // Capital N (officers data format)
    }
    
    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const fullName = `${firstName} ${lastName}`.trim()
    
    if (fullName) {
      return fullName
    }
    
    // Try single name field
    if (member.name) {
      return member.name
    }
    
    return 'Name not provided'
  }

  const getInitials = (member) => {
    if (!member) return 'M'
    
    // Try different field name conventions
    if (member.Name) {
      const nameParts = member.Name.split(' ')
      return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
    }
    
    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    
    if (initials.length > 0) {
      return initials
    }
    
    // Try single name field
    if (member.name) {
      const nameParts = member.name.split(' ')
      return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
    }
    
    return 'M'
  }

  const getProfileImage = () => {
    // For now, using Scott's image as example - could be expanded to support member photos
    if (memberData?.imgScott) {
      return imgScott
    }
    return null
  }

  const formatAddress = (member) => {
    if (!member) return null
    const parts = [
      member.address1,
      member.address2,
      member.city,
      member.state,
      member.zip
    ].filter(Boolean)
    
    return parts.length > 0 ? parts.join(', ') : null
  }

  const formatPhone = (phone) => {
    if (!phone) return null
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const getMilestoneInfo = () => {
    const worldCount = memberData?.worldCount || 0
    
    if (worldCount >= 1000) {
      return {
        icon: Diamond,
        color: '#9c27b0', // Purple
        text: '1000+',
        tooltip: '1000+ World Species',
        level: 'master',
        bgColor: '#f3e5f5',
        borderColor: '#9c27b0'
      }
    } else if (worldCount >= 500) {
      return {
        icon: EmojiEvents,
        color: '#ff9800', // Gold  
        text: '500+',
        tooltip: '500+ World Species',
        level: 'expert',
        bgColor: '#fff3e0',
        borderColor: '#ff9800'
      }
    } else if (worldCount >= 250) {
      return {
        icon: WorkspacePremium,
        color: '#4caf50', // Green
        text: '250+',
        tooltip: '250+ World Species',
        level: 'advanced',
        bgColor: '#e8f5e9',
        borderColor: '#4caf50'
      }
    } else if (worldCount >= 100) {
      return {
        icon: Star,
        color: '#2196f3', // Blue
        text: '100+',
        tooltip: '100+ World Species',
        level: 'accomplished',
        bgColor: '#e3f2fd',
        borderColor: '#2196f3'
      }
    }
    
    return null
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading member profile...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/members-directory')}
          sx={{ mb: 3 }}
        >
          Back to Directory
        </Button>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    )
  }

  const profileImage = getProfileImage()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/members-directory')}
        sx={{ mb: 3 }}
      >
        Back to Directory
      </Button>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Header with photo and basic info */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              {profileImage ? (
                <Avatar
                  src={profileImage}
                  alt={formatName(memberData)}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mx: 'auto', 
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.main'
                  }}
                />
              ) : (
                <Avatar
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    fontWeight: 600,
                    border: '4px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  {getInitials(memberData)}
                </Avatar>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h4" component="h1" color="primary">
                  {formatName(memberData)}
                </Typography>
                {(() => {
                  const milestone = getMilestoneInfo()
                  if (milestone) {
                    const IconComponent = milestone.icon
                    return (
                      <IconComponent 
                        sx={{ 
                          color: milestone.color,
                          fontSize: 32
                        }}
                        titleAccess={milestone.tooltip}
                      />
                    )
                  }
                  return null
                })()}
              </Box>
              
              {memberData?.position && (
                <Chip 
                  label={memberData.position} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mb: 2 }}
                />
              )}
              
              {memberData?.status && (
                <Chip 
                  icon={<Verified />} 
                  label={memberData.status} 
                  color="success" 
                  size="medium"
                />
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom color="primary">
                Contact Information
              </Typography>
              <List dense>
                {(memberData?.showEmail === true || isOwnProfile()) && (
                  <ListItem>
                    <ListItemIcon>
                      <Email color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email"
                      secondary={memberData?.email || 'Not provided'}
                    />
                  </ListItem>
                )}
                
                {memberData?.phone && (memberData?.showPhone === true || isOwnProfile()) && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone"
                      secondary={formatPhone(memberData.phone)}
                    />
                  </ListItem>
                )}
                
                {formatAddress(memberData) && (
                  <ListItem>
                    <ListItemIcon>
                      <Home color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address"
                      secondary={formatAddress(memberData)}
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
                    {(() => {
                      const milestone = getMilestoneInfo()
                      return (
                        <Card variant="outlined" sx={{ 
                          textAlign: 'center', 
                          p: 2,
                          bgcolor: milestone ? milestone.bgColor : 'white',
                          border: milestone ? '2px solid' : '1px solid',
                          borderColor: milestone ? milestone.borderColor : 'grey.300'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                            <Public color="secondary" sx={{ fontSize: 40 }} />
                          </Box>
                          <Typography variant="h4" color="secondary">
                            {memberData.worldCount}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Species Sighted Worldwide
                          </Typography>
                          {milestone && (
                            <Typography variant="caption" sx={{ 
                              color: milestone.color,
                              fontWeight: 'bold',
                              display: 'block',
                              mt: 1
                            }}>
                              {milestone.level === 'master' && '💎'}
                              {milestone.level === 'expert' && '🏆'}
                              {milestone.level === 'advanced' && '🏅'}
                              {milestone.level === 'accomplished' && '⭐'}
                              {' '}{milestone.text}
                            </Typography>
                          )}
                        </Card>
                      )
                    })()}
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default MemberProfile