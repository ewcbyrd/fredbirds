import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { getPictureUrl } from '../services/cloudinaryService'
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination
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
  LinkedIn,
  Launch,
  ArrowBack,
  Event as EventIcon
} from '@mui/icons-material'
import { getMemberByEmail, getMemberEvents } from '../services/restdbService'
import { formatName, getInitials, formatPhone, getMilestoneInfo, isOwnProfile } from '../utils/memberUtils'
import { formatMemberEventDate } from '../utils/dateUtils'
import Breadcrumbs from './common/Breadcrumbs'

const MemberProfile = () => {
  const { email } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth0()
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [memberEvents, setMemberEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [eventsPage, setEventsPage] = useState(1)
  const eventsPerPage = 5

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

  // Load member events when memberData is available
  useEffect(() => {
    const fetchMemberEvents = async () => {
      if (!memberData?._id) return

      try {
        setLoadingEvents(true)
        const events = await getMemberEvents(memberData._id)
        // Sort events by start date in descending order (most recent first)
        const sortedEvents = (events || []).sort((a, b) => {
          return new Date(b.eventStart) - new Date(a.eventStart)
        })
        setMemberEvents(sortedEvents)
      } catch (err) {
        console.error('Error fetching member events:', err)
        setMemberEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchMemberEvents()
  }, [memberData])

  const handleEventsPageChange = (event, value) => {
    setEventsPage(value)
  }

  const getProfileImage = () => {
    // Return Cloudinary URL if picture exists
    return getPictureUrl(memberData?.picture)
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

  const breadcrumbItems = [
    { label: 'Members', path: '/members-directory' },
    { label: `${memberData?.first} ${memberData?.last}`, path: location.pathname }
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs customCrumbs={breadcrumbItems} />

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
                  const milestone = getMilestoneInfo(memberData)
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
                {(memberData?.showEmail === true || isOwnProfile(user, memberData)) && (
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
                
                {memberData?.phone && (memberData?.showPhone === true || isOwnProfile(user, memberData)) && (
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
          {(memberData?.ebirdProfileUrl || memberData?.facebook || memberData?.linkedin) && (
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

                {memberData?.linkedin && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinkedIn color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            LinkedIn
                          </Typography>
                          <a
                            href={memberData.linkedin}
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
                      const milestone = getMilestoneInfo(memberData)
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

          {/* Event Attendance History */}
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <EventIcon color="primary" />
              <Typography variant="h6" color="primary">
                Event Attendance History
              </Typography>
              {!loadingEvents && memberEvents.length > 0 && (
                <Chip
                  label={`${memberEvents.length} ${memberEvents.length === 1 ? 'Event' : 'Events'}`}
                  color="primary"
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 32
                  }}
                />
              )}
            </Box>

            {loadingEvents ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading events...
                </Typography>
              </Box>
            ) : memberEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No event attendance history yet.
              </Typography>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '60%' }}><strong>Event</strong></TableCell>
                        <TableCell sx={{ width: '40%' }}><strong>Date</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberEvents
                        .slice((eventsPage - 1) * eventsPerPage, eventsPage * eventsPerPage)
                        .map((event, index) => (
                          <TableRow key={event._id || index}>
                            <TableCell sx={{ width: '60%' }}>
                              <Typography variant="body2">
                                {event.eventTitle || 'Untitled Event'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: '40%' }}>
                              <Typography variant="body2" color="text.secondary">
                                {formatMemberEventDate(event.eventStart, event.eventEnd)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {Math.ceil(memberEvents.length / eventsPerPage) > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(memberEvents.length / eventsPerPage)}
                      page={eventsPage}
                      onChange={handleEventsPageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        </CardContent>
      </Card>
    </Container>
  )
}

export default MemberProfile